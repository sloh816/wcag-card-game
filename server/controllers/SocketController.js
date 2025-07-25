const { Server } = require("socket.io");
const Room = require("../models/Room");
const Game = require("../models/Game");

class SocketController {
	constructor(server) {
		this.server = server;
		this.io = new Server(this.server, {
			cors: { origin: process.env.NEXT_PUBLIC_CLIENT_URL }
		});
		this.rooms = { "00001": new Room("00001") };
		this.connect();
	}

	connect() {
		console.log(this.rooms);
		this.io.on("connection", (socket) => {
			console.log("A user connected with ID:", socket.id);

			socket.on("get room data", (roomCode) => {
				socket.join(roomCode);
				if (!this.roomExists(roomCode)) return;

				if (this.rooms[roomCode]) {
					const room = this.rooms[roomCode];
					socket.emit("room data", room.get());
				} else {
					socket.emit("error", { roomNotFound: true, message: "Room does not exist." });
				}
			});

			socket.on("create room", (id) => {
				const newRoom = new Room(id);
				const newRoomId = newRoom.id;
				this.rooms[newRoomId] = newRoom;

				console.log(`Room created with ID: ${newRoomId}`);
				console.log(this.rooms);

				socket.emit("room created", newRoomId);
			});

			socket.on("join room", (roomCode, nickname) => {
				console.log(`\n=== JOIN ROOM DEBUG ===`);
				console.log(`Socket ID: ${socket.id}`);
				console.log(`Room Code: ${roomCode}`);
				console.log(`Nickname: ${nickname}`);

				socket.join(roomCode);

				// Check if the room exists
				if (!this.roomExists(roomCode)) return;

				// if the game has already started, only allow existing players to join
				const room = this.rooms[roomCode];
				console.log(`Game started: ${room.gameStarted}`);
				console.log(`Player exists: ${room.playerExists(nickname)}`);

				if (room.gameStarted && !room.playerExists(nickname)) {
					console.log(`Rejecting: Game started and player doesn't exist`);
					socket.emit("error", {
						gameStarted: true,
						message: "Game has already started. Cannot join."
					});
					return;
				}

				// Check if player exists and has an active socket connection
				if (room.playerExists(nickname)) {
					const existingPlayer = room.getPlayer(nickname);
					console.log(`Existing player socketId: ${existingPlayer.socketId}`);
					console.log(`Current socket ID: ${socket.id}`);

					if (existingPlayer.socketId && existingPlayer.socketId !== socket.id) {
						console.log(`Rejecting: Player already connected with different socket`);
						// Player is already connected from another tab/window
						socket.emit("error", {
							error: "Player already connected",
							message: "Player already exists in the room."
						});
						return;
					}

					if (room.gameStarted) {
						console.log(
							`Allowing reconnection: Player exists and game started - rejoining game`
						);
					} else {
						console.log(
							`Allowing reconnection: Player exists but no active socket or same socket`
						);
					}
					// If player exists but no socketId, allow reconnection (handled in addPlayer)
				} else {
					console.log(`New player joining`);
				}

				console.log(`Adding player to room...`);
				room.addPlayer(nickname, socket.id);

				socket.emit("response", {
					success: true,
					message: "Joined room successfully."
				});

				this.emitRoomData(roomCode);

				// Add the player to the room
				console.log(`User ${nickname} joined room ${roomCode}`);
				console.log(
					`Current room players:`,
					room.players.map((p) => ({ name: p.name, socketId: p.socketId }))
				);
				console.log(`=== END JOIN ROOM DEBUG ===\n`);
			});

			socket.on("disconnect", () => {
				console.log(`User with ID ${socket.id} disconnected`);
				this.leaveRoom(socket.id);
			});

			socket.on("start game", (roomCode) => {
				// Check if the room exists
				if (!this.roomExists(roomCode)) return;

				const room = this.rooms[roomCode];
				if (!room.gameStarted) {
					room.gameStarted = true;
					const game = new Game(room);
					game.startGame();
					room.game = game;
					this.emitRoomData(roomCode);
				}
			});

			socket.on("draw card", (roomCode, playerName) => {
				if (!this.roomExists(roomCode)) return;

				const room = this.rooms[roomCode];
				if (room.game) {
					const player = room.getPlayer(playerName);
					room.game.drawCards(player);
					console.log(room.get());
					this.emitRoomData(roomCode);
				}
			});

			socket.on("reset game", (roomCode) => {
				if (!this.roomExists(roomCode)) return;
				const room = this.rooms[roomCode];
				if (room.game) {
					room.game.startGame();
					this.emitRoomData(roomCode);
				}
			});
		});
	}

	// sends the current state of the room to all clients in the room
	emitRoomData(roomCode) {
		if (this.rooms[roomCode]) {
			const room = this.rooms[roomCode];
			this.io.to(roomCode).emit("room data", room.get());
		}
	}

	// logic for when a player leaves/disconnects from a room
	leaveRoom(socketId) {
		// remove socket.id from the player's object
		Object.keys(this.rooms).forEach((roomCode) => {
			const room = this.rooms[roomCode];
			const player = room.players.find((player) => player.socketId === socketId);
			if (player) {
				if (room.gameStarted) {
					player.setSocketId(null);
				} else {
					room.removePlayer(player);
					if (room.players.length === 0) {
						delete this.rooms[roomCode];
						console.log(`Room ${roomCode} has been deleted.`);
					}
				}
			}

			this.emitRoomData(roomCode);
		});
	}

	// check if room exists
	roomExists(roomCode) {
		if (!this.rooms[roomCode]) {
			this.io
				.to(roomCode)
				.emit("error", { roomNotFound: true, message: "Room does not exist." });
			return false;
		}
		return true;
	}
}

module.exports = SocketController;

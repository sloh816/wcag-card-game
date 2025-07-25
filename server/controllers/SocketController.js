const { Server } = require("socket.io");
const Room = require("../models/Room");
const Game = require("../models/Game");

class SocketController {
	constructor(server) {
		this.server = server;
		this.io = new Server(this.server, {
			cors: { origin: process.env.NEXT_PUBLIC_CLIENT_URL }
		});
		this.rooms = {};
		this.connect();
	}

	connect() {
		this.io.on("connection", (socket) => {
			console.log("A user connected with ID:", socket.id);

			socket.on("create room", (id) => {
				const newRoom = new Room(id);
				const newRoomId = newRoom.id;
				this.rooms[newRoomId] = newRoom;

				console.log(`Room created with ID: ${newRoomId}`);
				console.log(this.rooms);

				socket.emit("room created", newRoomId);
			});

			socket.on("join room", (roomCode, nickname) => {
				socket.join(roomCode);

				// Check if the room exists
				if (!this.roomExists(roomCode)) return;

				// if the game has already started, do not allow joining
				const room = this.rooms[roomCode];
				if (room.gameStarted && !room.playerExists(nickname)) {
					socket.emit("error", {
						gameStarted: true,
						message: "Game has already started. Cannot join."
					});
				} else {
					room.addPlayer(nickname, socket.id);
					this.emitRoomData(roomCode);
				}

				// Add the player to the room
				console.log(`User ${nickname} joined room ${roomCode}`);
				console.log(room.get());
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

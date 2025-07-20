const { Server } = require("socket.io");
const Room = require("../models/Room");

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

				if (!this.rooms[roomCode]) {
					console.error(`Room ${roomCode} does not exist`);
					this.io.to(roomCode).emit("error", `Room ${roomCode} does not exist`);
					return;
				}

				const room = this.rooms[roomCode];
				room.addPlayer(nickname, socket.id);

				console.log(`User ${nickname} joined room ${roomCode}`);
				console.log(room.get());

				this.emitRoomData(roomCode);
			});

			socket.on("disconnect", () => {
				console.log(`User with ID ${socket.id} disconnected`);

				// remove socket.id from the player's object
				Object.keys(this.rooms).forEach((roomCode) => {
					const room = this.rooms[roomCode];
					const player = room.players.find((player) => player.socketId === socket.id);

					if (player) {
						player.setSocketId(null);
					}

					this.emitRoomData(roomCode);
				});
			});
		});
	}

	emitRoomData(roomCode) {
		if (this.rooms[roomCode]) {
			const room = this.rooms[roomCode];
			this.io.to(roomCode).emit("room data", room.get());
		}
	}
}

module.exports = SocketController;

import axios from "axios";
import { io } from "socket.io-client";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const socket = io(serverUrl);

if (!serverUrl) {
	throw new Error("❌ SERVER_URL is not defined");
}

const api = {
	checkConnection: async () => {
		try {
			const response = await axios.get(`${serverUrl}/check-connection`);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getRoomData: (roomCode) => {
		return new Promise((resolve, reject) => {
			try {
				// Clean up any existing listeners first
				socket.off("room data");
				socket.off("error");

				const handleRoomData = (data) => {
					socket.off("room data", handleRoomData);
					socket.off("error", handleError);
					resolve(data);
				};

				const handleError = (error) => {
					socket.off("room data", handleRoomData);
					socket.off("error", handleError);
					resolve(error);
				};

				socket.on("room data", handleRoomData);
				socket.on("error", handleError);

				socket.emit("get room data", roomCode);
			} catch (error) {
				console.error("Error getting room data:", error);
				reject(error);
			}
		});
	},

	createRoom: (id) => {
		return new Promise((resolve, reject) => {
			try {
				socket.emit("create room", id);
				socket.on("room created", (code) => {
					console.log(`Room created with code: ${code}`);
					resolve(code);
				});
			} catch (error) {
				console.error("Error creating room:", error);
				reject(error);
			}
		});
	},

	joinRoom: (roomCode, nickname) => {
		return new Promise((resolve, reject) => {
			try {
				// Clean up any existing listeners first
				socket.off("error");
				socket.off("response");

				const handleError = (error) => {
					socket.off("error", handleError);
					socket.off("response", handleResponse);
					resolve(error);
				};

				const handleResponse = (response) => {
					socket.off("error", handleError);
					socket.off("response", handleResponse);
					resolve(response);
				};

				socket.on("error", handleError);
				socket.on("response", handleResponse);

				socket.emit("join room", roomCode, nickname);
			} catch (error) {
				console.error("Error joining room:", error);
				reject(error);
			}
		});
	},

	startGame: (roomCode) => {
		return new Promise((resolve, reject) => {
			try {
				socket.emit("start game", roomCode);
				resolve();
			} catch (error) {
				console.error("Error starting game:", error);
				reject(error);
			}
		});
	},

	drawCard: (roomCode, playerName) => {
		return new Promise((resolve, reject) => {
			try {
				socket.emit("draw card", roomCode, playerName);
				resolve();
			} catch (error) {
				console.error("Error drawing card:", error);
				reject(error);
			}
		});
	},

	resetGame: (roomCode) => {
		return new Promise((resolve, reject) => {
			try {
				socket.emit("reset game", roomCode);
				resolve();
			} catch (error) {
				console.error("Error resetting game:", error);
				reject(error);
			}
		});
	},

	getSocket: () => {
		return socket;
	}
};

export default api;

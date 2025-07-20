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
				socket.emit("join room", roomCode, nickname);
				socket.on("error", (errorMessage) => {
					resolve({ error: errorMessage });
				});
			} catch (error) {
				console.error("Error joining room:", error);
				reject(error);
			}
		});
	},

	getSocket: () => {
		return socket;
	}
};

export default api;

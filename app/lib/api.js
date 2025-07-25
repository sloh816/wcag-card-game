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
                socket.emit("get room data", roomCode);
                socket.on("room data", (data) => {
                    resolve(data);
                });

                socket.on("error", (error) => {
                    resolve(error);
                });
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
                socket.emit("join room", roomCode, nickname);
                socket.on("error", (error) => {
                    resolve(error);
                });

                socket.on("response", (response) => {
                    resolve(response);
                });
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
    },
};

export default api;

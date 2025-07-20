const { generateUUID } = require("../utils/strings");
const Player = require("./Player");

class Room {
	constructor(id) {
		this.id = id || generateUUID().slice(0, 4).toUpperCase();
		this.players = [];
		this.gameStarted = false;
		this.admin = null;
	}

	get() {
		return {
			id: this.id,
			players: this.getPlayers(),
			gameStarted: this.gameStarted,
			admin: this.getAdmin()
		};
	}

	getPlayers() {
		return this.players.map((player) => player.get());
	}

	getAdmin() {
		return this.admin ? this.admin.get() : null;
	}

	addPlayer(nickname, socketId) {
		if (this.players.some((player) => player.name === nickname)) {
			const thisPlayer = this.players.find((player) => player.name === nickname);
			thisPlayer.setSocketId(socketId);
			console.log(
				`${nickname} is already in the room ${this.id}. Updating socket ID to ${socketId}.`
			);
			return;
		}

		this.players.push(new Player(nickname, socketId));

		if (!this.admin) {
			this.admin = this.players[0];
		}
	}
}

module.exports = Room;

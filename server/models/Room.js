const { generateUUID } = require("../utils/strings");
const Player = require("./Player");

class Room {
	constructor(id) {
		this.id = id || generateUUID().slice(0, 4).toUpperCase();
		this.players = [];
		this.gameStarted = false;
		this.admin = null;
		this.game = null;
	}

	get() {
		return {
			id: this.id,
			players: this.players.map((player) => player.get()),
			gameStarted: this.gameStarted,
			admin: this.admin ? this.admin.get() : null,
			game: this.game ? this.game.get() : null
		};
	}

	getPlayer(name) {
		return this.players.find((player) => player.name === name);
	}

	addPlayer(nickname, socketId) {
		// if the player is already in the room, update their socket ID
		if (this.playerExists(nickname)) {
			const thisPlayer = this.players.find((player) => player.name === nickname);
			thisPlayer.setSocketId(socketId);
			console.log(
				`${nickname} is already in the room ${this.id}. Updating socket ID to ${socketId}.`
			);
			return;
		}

		this.players.push(new Player(nickname, socketId));

		// if there's no admin, set the first player as the admin
		if (!this.admin) {
			this.admin = this.players[0];
		}
	}

	removePlayer(player) {
		const index = this.players.indexOf(player);
		if (index !== -1) {
			// remove player from the players array
			this.players.splice(index, 1);
			console.log(`Player ${player.name} removed from room ${this.id}`);

			// if the removed player was the admin, set a new admin
			if (this.admin && this.admin.name === player.name) {
				this.admin = this.players.length > 0 ? this.players[0] : null;
				console.log(`New admin is now ${this.admin ? this.admin.name : "none"}`);
			}
		}
	}

	playerExists(nickname) {
		return this.players.some((player) => player.name === nickname);
	}
}

module.exports = Room;

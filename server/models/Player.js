class Player {
	constructor(name, socketId) {
		this.name = name;
		this.socketId = socketId;
		this.isReady = false; // Indicates if the player is ready to start the game
	}

	setReady(ready) {
		this.isReady = ready;
	}

	get() {
		return {
			name: this.name,
			socketId: this.socketId,
			isReady: this.isReady
		};
	}

	setSocketId(socketId) {
		this.socketId = socketId;
	}
}

module.exports = Player;

class Player {
	constructor(name, socketId) {
		this.name = name;
		this.socketId = socketId;
		this.hand = [];
	}

	get() {
		return {
			name: this.name,
			socketId: this.socketId,
			hand: this.hand.map((card) => card.get())
		};
	}

	setSocketId(socketId) {
		this.socketId = socketId;
	}
}

module.exports = Player;

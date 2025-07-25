const A11yCard = require("./A11yCard");
const UserCard = require("./UserCard");

class Game {
	constructor(room) {
		this.players = room.players;
		this.userDeck = [];
		this.drawPile = [];
		this.discardPile = [];
		this.userCard = null;
	}

	get() {
		return {
			players: this.players.map((player) => player.get()),
			drawPile: this.drawPile.map((card) => card.get()),
			userDeck: this.userDeck.map((card) => card.get()),
			userCard: this.userCard ? this.userCard.get() : null
		};
	}

	startGame() {
		this.generateDrawPile();
		this.generateUserDeck();

		this.players.forEach((player) => {
			this.clearHand(player);
			this.drawCards(player, 5);
		});

		this.setUserCard();

		console.dir(this.get(), { depth: null, colors: true });
	}

	generateDrawPile() {
		this.getA11yCards().forEach((card) => {
			for (let i = 0; i < 4; i++) {
				const a11yCard = new A11yCard(
					card.title,
					card.description,
					card.wcagSc,
					card.number
				);
				this.drawPile.push(a11yCard);
			}
		});

		this.getActionCards().forEach((card) => {
			for (let i = 0; i < 5; i++) {
				const actionCard = new A11yCard(card.title, card.description, "", null);
				this.drawPile.push(actionCard);
			}
		});

		this.shuffleDeck(this.drawPile);
	}

	generateUserDeck() {
		this.getUserCards().forEach((card) => {
			for (let i = 0; i < 5; i++) {
				const userCard = new UserCard(card.name, card.description, card.a11yNumbers);
				this.userDeck.push(userCard);
			}
		});

		this.shuffleDeck(this.userDeck);
	}

	setUserCard() {
		const card = this.userDeck.pop();
		this.userCard = card;
	}

	shuffleDeck(deck) {
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
	}

	reshuffleDiscardPile() {
		if (this.discardPile.length === 0) {
			this.drawPile = this.discardPile;
			this.discardPile = [];
			this.shuffleDeck(this.drawPile);
			console.log("Reshuffled the discard pile into the draw pile.");
		}
	}

	drawCards(player, num = 1) {
		for (let i = 0; i < num; i++) {
			if (this.drawPile.length === 0) {
				console.log("No more cards in the accessibility deck to draw from.");
				this.reshuffleDiscardPile();
			}
			const card = this.drawPile.pop();
			player.hand.push(card);
		}
	}

	clearHand(player) {
		player.hand = [];
		console.log(`Cleared hand for player ${player.name}`);
	}

	getA11yCards() {
		return [
			{
				title: "Text alternative",
				description: "Images have alt text or are marked as decorative",
				wcagSc: "1.1.1",
				number: 1
			},
			{
				title: "Descriptive labels",
				description:
					"Buttons and links have descriptive labels and not just 'click here...', for example",
				wcagSc: "1.1.1, 2.4.4, 2.4.6, 2.5.3, 3.3.2",
				number: 2
			},
			{
				title: "Videos have titles",
				description: "Embedded media, such as audio and videos, have titles",
				wcagSc: "1.1.1",
				number: 3
			},
			{
				title: "Transcripts or Audio Descriptions",
				description:
					"A transcript or audio description is available as an alternative for audio or videos",
				wcagSc: "1.2.1, 1.2.3",
				number: 4
			},
			{
				title: "Captions",
				description: "Videos have synchronised captions available",
				wcagSc: "1.2.3",
				number: 5
			},
			{
				title: "Heading levels",
				description: "Proper heading level structure is used",
				wcagSc: "1.3.1, 2.4.6",
				number: 6
			},
			{
				title: "Tags",
				description: "PDFs are tagged and HTML uses correct semantic markup",
				wcagSc: "1.3.1, 4.1.2",
				number: 7
			},
			{
				title: "Data tables",
				description: "Provide data tables as an alternative for graphs or charts",
				wcagSc: "1.3.1",
				number: 8
			},
			{
				title: "Reading order",
				description: "PDFs and HTML have a logical reading and navigational order",
				wcagSc: "1.2.3, 2.4.3",
				number: 9
			},
			{
				title: "Use of colour",
				description:
					"Colour alone is not used to convey information. Eg. links are also underlined.",
				wcagSc: "1.4.1",
				number: 10
			},
			{
				title: "Colour contrast",
				description:
					"Text and images have a contrast of at least 4.5:1 and large text is at least 3:1",
				wcagSc: "1.4.3",
				number: 11
			},
			{
				title: "Resizable",
				description: "Webpages are readable and functional when zoomed to 400%",
				wcagSc: "1.4.4, 1.4.10",
				number: 12
			},
			{
				title: "Keyboard accessible",
				description: "All functionality can be achieved with the keyboard only",
				wcagSc: "2.1.1",
				number: 13
			},
			{
				title: "Reduce motion",
				description:
					"Automatic motion doesn’t last longer than 5 secs. If so, it can be paused, stopped or hidden",
				wcagSc: "2.2.2",
				number: 14
			},
			{
				title: "Skip to main content",
				description:
					"A link is provided for keyboard users, at the start of a webpage, to skip to the main content",
				wcagSc: "2.4.1",
				number: 15
			},
			{
				title: "Page title",
				description: "Documents have a title",
				wcagSc: "2.4.2",
				number: 16
			},
			{
				title: "Large target size",
				description: "Clickable targets are at least 24x24 pixels",
				wcagSc: "2.5.8",
				number: 17
			},
			{
				title: "Plain language",
				description:
					"Provide content in a way that is clear, concise, and can be reasonably understood at a grade 7-8 reading level.",
				wcagSc: "3.1.5",
				number: 18
			},
			{
				title: "Use images",
				description: "Use images to help convey and simplify complex information",
				wcagSc: "3.1.5",
				number: 19
			},
			{
				title: "Consistency",
				description:
					"Navigation and elements with the same meaning or functionality and presented in a consistent way",
				wcagSc: "3.2.3, 3.2.4",
				number: 20
			}
		];
	}

	getActionCards() {
		return [
			{
				title: "Change user",
				description:
					"Shuffle the current user back into the user deck and draw a new user. Everyone’s accessibility cards return to their hand."
			},
			{
				title: "Block",
				description:
					"Choose another player and place this card in front of them. They cannot play a card in their next turn. They can discard this card in their next turn."
			},
			{
				title: "Inaccessible",
				description: "Remove an active accessibility card from another player."
			},
			{
				title: "Wild card",
				description: "This card can act as an accessibility card for any user."
			},
			{
				title: "Steal",
				description:
					"Take an active accessibility card from another player and add it to your hand."
			}
		];
	}

	getUserCards() {
		return [
			{
				name: "A",
				description: "Fully blind, screen-reader user",
				a11yNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 15, 16, 20]
			},
			{
				name: "B",
				description: "Keyboard user, limited motor skills, likes simple language",
				a11yNumbers: [7, 9, 12, 13, 15, 17, 18, 19, 20]
			},
			{
				name: "C",
				description:
					"Low vision, partially colour blind, limited motor skills, sometimes uses keyboard-only",
				a11yNumbers: [1, 2, 4, 6, 7, 8, 10, 11, 12, 13, 15, 17]
			},
			{
				name: "D",
				description:
					"Gets motion sick, easily overwhelmed by lots of text, struggles to read.",
				a11yNumbers: [2, 3, 6, 11, 14, 16, 18, 19, 20]
			},
			{
				name: "E",
				description:
					"English as a second language, confused when there’s lots of colour and movement, is elderly with slightly poor vision",
				a11yNumbers: [5, 10, 11, 12, 14, 16, 17, 18, 19]
			}
		];
	}
}

module.exports = Game;

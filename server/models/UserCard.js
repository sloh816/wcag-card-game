class UserCard {
	constructor(name, description, a11yNumbers) {
		this.name = name;
		this.description = description;
		this.a11yNumbers = a11yNumbers; // Array of A11y card numbers
	}

	get() {
		return {
			name: this.name,
			description: this.description,
			a11yNumbers: this.a11yNumbers
		};
	}
}

module.exports = UserCard;

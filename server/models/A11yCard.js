class A11yCard {
	constructor(title, description, wcagSc, number) {
		this.title = title;
		this.description = description;
		this.wcagSc = wcagSc;
		this.number = number;
	}

	get() {
		return {
			title: this.title,
			description: this.description,
			wcagSc: this.wcagSc,
			number: this.number
		};
	}
}

module.exports = A11yCard;

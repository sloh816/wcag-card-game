const { createDirectus, rest, readItems } = require("@directus/sdk");

class Directus {
	constructor() {
		this.directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
		this.directus = null;
		this.initDirectus();
	}

	initDirectus() {
		if (!this.directusUrl) {
			throw new Error("❌ DIRECTUS_URL is not defined");
		}

		this.directus = createDirectus(this.directusUrl).with(rest());
	}

	async getFontByName(fontName) {
		if (!this.directus) {
			throw new Error("❌ Directus instance is not initialized");
		}

		const fonts = await this.directus.request(readItems("fonts"));
		const font = fonts.find((f) => f.name.toLowerCase() === fontName.toLowerCase());

		return font || null;
	}
}

module.exports = Directus;

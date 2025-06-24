const {
	createDirectus,
	rest,
	readItems,
	readItem,
	readFile,
	readAssetArrayBuffer,
	uploadFiles,
	createItem
} = require("@directus/sdk");
const fileSystem = require("../utils/fileSystem");
const fs = require("fs");
// const FormData = require("form-data");
const getMimeType = require("../utils/getMimeType");
const { slugify } = require("../utils/strings");

class Directus {
	constructor() {
		this.directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
		this.directus = null;
		this.fontStyleMap = {
			regular: "regular_font_files",
			italic: "italic_font_files",
			bold: "bold_font_files"
		};
		this.initDirectus();
	}

	initDirectus() {
		if (!this.directusUrl) {
			throw new Error("❌ DIRECTUS_URL is not defined");
		}

		this.directus = createDirectus(this.directusUrl).with(rest());
	}

	async getFontByName(fontName) {
		try {
			const fonts = await this.directus.request(readItems("fonts"));
			const font = fonts.find((f) => f.name.toLowerCase() === fontName.toLowerCase());
			return font || null;
		} catch (error) {
			console.error("❌ Error fetching font by name:", error);
		}
	}

	async getFontFileByFontId(id, fontStyle) {
		try {
			const fontCollection = this.fontStyleMap[fontStyle];
			const regularFont = await this.directus.request(readItem(fontCollection, id));
			const fileId = regularFont?.directus_files_id;
			const file = await this.directus.request(readFile(fileId));
			return file || null;
		} catch (error) {
			console.error("❌ Error fetching regular font file:", error);
		}
	}

	async downloadFile(fileId, outputPath) {
		if (!this.directus) {
			throw new Error("❌ Directus instance is not initialized");
		}

		try {
			const fileBuffer = await this.directus.request(readAssetArrayBuffer(fileId));
			const buffer = Buffer.from(fileBuffer);
			fileSystem.writeFile(outputPath, buffer);
		} catch (error) {
			console.error("❌ Error downloading file:", error);
		}
	}

	async getFileById(id) {
		try {
			const file = await this.directus.request(readFile(id));
			return file || null;
		} catch (error) {
			console.error("❌ Error fetching file by ID:", error);
		}
	}

	async uploadFile(filePath, title, directusFolder) {
		const folderMap = {
			fonts: "4c8978d3-8227-4c58-a37d-e18e98034faf"
		};

		try {
			// get file data and create form data
			const fileBuffer = fs.readFileSync(filePath);
			const ext = filePath.split(".").pop();
			const fileName = slugify(title) + "." + ext;

			// create a file object for upload
			const file = new File([fileBuffer], fileName, {
				type: getMimeType(fileName)
			});

			const formData = new FormData();
			formData.append("title", title);
			formData.append("folder", folderMap[directusFolder]);
			formData.append("file", file);

			// Use SDK's request method
			const result = await this.directus.request(uploadFiles(formData));
			return result;
		} catch (error) {
			console.error("❌ Error uploading file:", error);
		}
	}

	async addFontFileRelation(fontId, fileId, fontStyle) {
		try {
			const fontCollection = this.fontStyleMap[fontStyle];
			await this.directus.request(
				createItem(fontCollection, {
					directus_files_id: fileId,
					fonts_id: fontId
				})
			);
		} catch (error) {
			console.error("❌ Error adding font file relation:", error);
		}
	}
}

module.exports = Directus;

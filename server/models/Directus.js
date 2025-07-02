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
const { ttfToWoff, otfToTtf } = require("../utils/toWoff");

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
			console.error("❌ Error fetching font file:", error);
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

	async createWoffFiles(font, fontFileId, fontStyle) {
		try {
			const fontFile = await this.getFileById(fontFileId);
			const tempOtfFilePath = "server/lib/temp/" + fontFileId + ".otf";
			const tempTtfFIlePath = "server/lib/temp/" + fontFileId + ".ttf";

			// Check if font file is a ttf or otf
			const ext = fontFile.filename_download.split(".").pop().toLowerCase();
			if (ext === "otf") {
				// if otf, convert to ttf first
				await this.downloadFile(fontFileId, tempOtfFilePath);
				await otfToTtf(tempOtfFilePath, tempTtfFIlePath);
			}

			// download ttf to temp folder
			await this.downloadFile(fontFileId, tempTtfFIlePath);

			const tempWoffPath = "server/lib/temp/" + fontFileId + ".woff";
			const tempWoff2Path = "server/lib/temp/" + fontFileId + ".woff2";

			// convert ttf to woff and woff2
			await ttfToWoff(tempTtfFIlePath, tempWoffPath);
			await ttfToWoff(tempTtfFIlePath, tempWoff2Path);

			// upload the woff and woff2 files to Directus
			const uploadedWoffFile = await this.uploadFile(
				tempWoffPath,
				font.name + " (WOFF)",
				"fonts"
			);
			const uploadedWoff2File = await this.uploadFile(
				tempWoff2Path,
				font.name + " (WOFF2)",
				"fonts"
			);

			// add relationship to the font
			await this.addFontFileRelation(font.id, uploadedWoffFile.id, fontStyle);
			await this.addFontFileRelation(font.id, uploadedWoff2File.id, fontStyle);

			// delete the temp files
			await fileSystem.deleteFile(tempTtfFIlePath);
			await fileSystem.deleteFile(tempWoffPath);
			await fileSystem.deleteFile(tempWoff2Path);

			return {
				woff: uploadedWoffFile,
				woff2: uploadedWoff2File
			};
		} catch (error) {
			console.error("❌ Error creating WOFF files:", error);
		}
	}

	async addFont(name, font_style, embed_code, type, filePath) {
		let font = null;

		// check if a font with the same name already exists
		const existingFont = await this.getFontByName(name);
		if (existingFont) {
			font = existingFont;
		} else {
			// create a new font item
			const newFont = await this.directus.request(
				createItem("fonts", {
					name,
					font_style,
					embed_code
				})
			);
			font = newFont;
		}

		// add the font file
		const uploadedFile = await this.uploadFile(filePath, name, "fonts");
		await this.addFontFileRelation(font.id, uploadedFile.id, type);

		// delete temp font file
		await fileSystem.deleteFile(filePath);

		// create WOFF files
		await this.createWoffFiles(font, uploadedFile.id, type);

		return font;
	}
}

module.exports = Directus;

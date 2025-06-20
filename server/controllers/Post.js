const express = require("express");
const multer = require("multer");
require("dotenv").config();

const fileSystem = require("../utils/fileSystem");
const Html = require("../models/Html");
const WordDocument = require("../models/WordDocument");

const upload = multer({
	dest: "server/lib/uploads/"
});

class PostController {
	constructor(app) {
		this.app = app;
		this.router = express.Router();
		this.routes();
		this.config();
	}

	config() {
		this.app.use(this.router);
	}

	routes() {
		this.router.post("/prepend-styles", upload.single("file"), this.prependStyles.bind(this));

		this.router.post(
			"/word-to-html",
			upload.fields([{ name: "file" }, { name: "favicon" }]),
			this.wordToHtml.bind(this)
		);
	}

	async prependStyles(req, res) {
		// check if there's a file
		const file = req.file;
		if (!file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// rename the uploaded file
		const uploadedHtml = await this.uploadFile(file);

		// process the uploaded file
		const html = new Html(uploadedHtml.file, uploadedHtml.folder);
		const outputFolder = "server/lib/downloads";
		const outputFileName = html.file.replace(".html", "_processed_for_word.html");
		await html.prependStyles(outputFolder, outputFileName);

		// get download path
		const downloadPath = this.getDownloadPath(html.file);
		res.json({ downloadPath });
	}

	async wordToHtml(req, res) {
		// check if there's a file
		const files = req.files;
		if (!files) {
			return res.status(400).json({ error: "No files uploaded" });
		}

		// rename the uploaded files
		const uploadedWordDoc = await this.uploadFile(files.file[0]);
		const uploadedFavion = files.favicon ? await this.uploadFile(files.favicon[0]) : null;

		try {
			const includeTemplate = req.body.includeTemplate === "true";
			const generateCss = req.body.generateCss === "true";

			// convert the Word document to HTML
			const filePath = uploadedWordDoc.folder + "/" + uploadedWordDoc.file;
			const wordDocument = new WordDocument(filePath);

			const html = await wordDocument.convertToHtml(
				includeTemplate,
				{
					documentTitle: req.body.documentTitle,
					favicon: uploadedFavion
				},
				generateCss
			);

			let fontsFound = false;

			if (generateCss) {
				const fonts = await wordDocument.getFonts();
				if (fonts && fonts.length > 0) {
					fontsFound = { fonts };
				}
			}

			const outputZipFile = await html.zip();
			const zipFileName = outputZipFile.split("/").pop();

			// get download path
			const downloadPath = this.getDownloadPath(zipFileName);
			res.json({ downloadPath, fontsFound, htmlFolder: html.folder });
		} catch (error) {
			res.status(500).json({ error: "Error processing Word document: " + error.message });
		}
	}

	async uploadFile(file) {
		// Rename uploaded file to original name + timestamp
		const fileExtension = file.originalname.split(".").pop();
		const fileName = file.originalname.replace("." + fileExtension, "");
		const newFileName = `${Date.now()}_${fileName}.${fileExtension}`;

		const folder = "server/lib/uploads";
		const newFilePath = folder + "/" + newFileName;
		await fileSystem.renameFile(file.path, newFilePath);

		console.log("✅📁 File uploaded:", newFilePath);

		return { file: newFileName, folder };
	}

	getDownloadPath(fileName) {
		const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
		return `${serverUrl}/download/${fileName}`;
	}
}

module.exports = PostController;

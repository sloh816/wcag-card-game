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
		this.router.post("/word-to-html", upload.single("file"), this.wordToHtml.bind(this));
	}

	async prependStyles(req, res) {
		// check if there's a file
		const file = req.file;
		if (!file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// rename the uploaded file
		const filePath = await this.uploadFile(file);

		// process the uploaded file
		const html = new Html(filePath, "");
		const outputPath = filePath
			.replace("lib/uploads", "lib/downloads")
			.replace(".html", "-processed.html");
		await html.prependStyles(outputPath);

		// get download path
		const downloadFile = outputPath.split("/").pop();
		const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
		const downloadPath = `${serverUrl}/download/${downloadFile}`;
		res.json({ downloadPath });
	}

	async wordToHtml(req, res) {
		// check if there's a file
		const file = req.file;
		if (!file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// rename the uploaded file
		const filePath = await this.uploadFile(file);

		// convert the Word document to HTML
		const wordDocument = new WordDocument(filePath);
		await wordDocument.convertToHtml();

		res.json({
			message: "File uploaded successfully"
		});
	}

	async uploadFile(file) {
		// Rename uploaded file to original name + timestamp
		const fileExtension = file.originalname.split(".").pop();
		const fileName = file.originalname.replace("." + fileExtension, "");
		const newFileName = `${Date.now()}_${fileName}.${fileExtension}`;
		const newFilePath = `server/lib/uploads/${newFileName}`;
		await fileSystem.renameFile(file.path, newFilePath);

		console.log("✅📁 File uploaded:", newFilePath);

		return newFilePath;
	}
}

module.exports = PostController;

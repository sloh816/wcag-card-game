const express = require("express");
const multer = require("multer");
const fileSystem = require("../utils/fileSystem");
const Html = require("../models/Html");
require("dotenv").config();

const upload = multer({
	dest: "server/uploads/"
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
		const html = new Html(filePath);
		const newFilePath = await html.prependStyles();
		const downloadFile = newFilePath.split("/").pop();
		const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
		const downloadPath = `${serverUrl}/download/${downloadFile}`;
		res.json({ downloadPath });
	}

	async uploadFile(file) {
		// Rename uploaded file to original name + timestamp
		const fileName = file.originalname.split(".")[0];
		const fileExtension = file.originalname.split(".").pop();
		const newFileName = `${fileName}-${Date.now()}.${fileExtension}`;
		const newFilePath = `server/uploads/${newFileName}`;
		await fileSystem.renameFile(file.path, newFilePath);

		console.log("✅📁 File uploaded:", newFilePath);

		return newFilePath;
	}
}

module.exports = PostController;

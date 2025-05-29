const express = require("express");
const fs = require("fs");

class GetController {
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
		this.router.get("/download/:file", this.downloadFile.bind(this));
		this.router.get("/check-connection", this.checkConnection.bind(this));
	}

	async downloadFile(req, res) {
		const filename = req.params.file;
		if (!filename) {
			return res.status(400).send("File name is required");
		}

		const filePath = `server/lib/downloads/${filename}`;

		// Check if the file exists
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ error: "File not found" });
		}

		// Force download by setting these specific headers
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
		res.setHeader("Content-Type", "application/octet-stream");

		// Prevent caching to ensure fresh downloads
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		res.setHeader("Pragma", "no-cache");
		res.setHeader("Expires", "0");

		// Stream the file for download
		const fileStream = fs.createReadStream(filePath);
		fileStream.pipe(res);
	}

	async checkConnection(req, res) {
		try {
			// Check if the server is running
			res.status(200).json({ message: "Server is running" });
		} catch (error) {
			console.error("Error checking connection:", error);
			res.status(500).json({ error: "Server is not reachable" });
		}
	}
}

module.exports = GetController;

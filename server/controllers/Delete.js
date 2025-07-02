const express = require("express");
require("dotenv").config();

const clearLibFiles = require("../utils/clearTempFiles");

class DeleteController {
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
		this.router.delete("/delete-lib-files", this.deleteLibFiles.bind(this));
	}

	async deleteLibFiles(req, res) {
		const folders = req.body;
		if (!Array.isArray(folders) || folders.length === 0) {
			return res.status(400).json({ error: "Invalid or empty folders array." });
		} else {
			try {
				await clearLibFiles(folders);
				return res.status(200).json({ message: "Library files deleted successfully." });
			} catch (error) {
				console.error("❌ Error deleting library files:", error);
				return res.status(500).json({ error: "Failed to delete library files." });
			}
		}
	}
}

module.exports = DeleteController;

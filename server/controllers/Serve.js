const express = require("express");
const path = require("path");

class ServeController {
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
		this.router.use("/download/:file", this.serveDownloads.bind(this));
	}

	serveDownloads(req, res, next) {
		const { file } = req.params;
		const filePath = path.join(__dirname, `../lib/downloads/${file}`);
		express.static(filePath)(req, res, next);
	}
}

module.exports = ServeController;

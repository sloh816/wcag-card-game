const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require("node:http");
const path = require("node:path");
require("dotenv").config({ path: "./.env.local" });

const SocketController = require("./controllers/SocketIo");

class Express {
	constructor(port) {
		this.app = express();
		this.port = port;
		this.server = createServer(this.app);
		this.config();
		this.routes();
	}

	config() {
		// middleware
		this.app.use(cors());
		this.app.use(bodyParser.json());
	}

	// load routes from controllers
	routes() {
		try {
			this.app.get("/", (req, res) => {
				const indexPath = path.join(__dirname, "index.html");
				res.sendFile(indexPath);
			});

			this.app.get("/check-connection", (req, res) => {
				res.status(200).json({ message: "Connection successful" });
			});

			new SocketController(this.server);
		} catch (error) {
			console.error("Error loading routes:", error);
		}
	}

	start() {
		this.server.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}
}

const server = new Express(process.env.SERVER_PORT);
server.start();

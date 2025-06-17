const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const PostController = require("./controllers/Post");
const ServeController = require("./controllers/Serve");
const GetController = require("./controllers/Get");

class Server {
	constructor(port) {
		this.app = express();
		this.port = port;
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
			new PostController(this.app);
			new GetController(this.app);
			new ServeController(this.app);

			this.app.get("/", (req, res) => {
				res.send("Hello from root!");
			});
		} catch (error) {
			console.error("Error loading routes:", error);
		}
	}

	start() {
		this.app.listen(this.port, "127.0.0.1", () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}
}

const server = new Server(4001);
server.start();

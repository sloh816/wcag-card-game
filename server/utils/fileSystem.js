const fsp = require("fs").promises;
const fs = require("fs");
const path = require("path");

const fileSystem = {
	renameFile: async (oldPath, newPath) => {
		try {
			await fsp.rename(oldPath, newPath);
			return newPath;
		} catch (err) {
			console.error("❌📂 Error renaming file:", err);
			throw err;
		}
	},

	readFile: async (filePath) => {
		try {
			const data = await fsp.readFile(filePath, "utf-8");
			return data;
		} catch (err) {
			console.error("❌📂 Error reading file:", err);
			throw err;
		}
	},

	writeFile: async (filePath, data) => {
		try {
			await fsp.writeFile(filePath, data, "utf-8");
			return filePath;
		} catch (err) {
			console.error("❌📂 Error writing file:", err);
			throw err;
		}
	}
};

module.exports = fileSystem;

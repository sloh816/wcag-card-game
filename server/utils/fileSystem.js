const fsp = require("fs").promises;
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const AdmZip = require("adm-zip");

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
	},

	createFolder: async (folderPath) => {
		try {
			// Check if the folder already exists
			if (fs.existsSync(folderPath)) {
				console.log("✅📂 Folder already exists:", folderPath);
				return folderPath;
			}
			await fsp.mkdir(folderPath, { recursive: true });
			return folderPath;
		} catch (err) {
			console.error("❌📂 Error creating folder:", err);
			throw err;
		}
	},

	copyFile: async (source, destination) => {
		try {
			await fsp.copyFile(source, destination);
			console.log("✅📂 File copied from", source, "to", destination);
			return destination;
		} catch (err) {
			console.error("❌📂 Error copying file:", err);
			throw err;
		}
	},

	unzipFile: async (zipFilePath, destination) => {
		try {
			await fs
				.createReadStream(zipFilePath)
				.pipe(unzipper.Extract({ path: destination }))
				.promise();
			console.log("✅📂 File unzipped to", destination);
			return destination;
		} catch (err) {
			console.error("❌📂 Error unzipping file:", err);
			throw err;
		}
	},

	deleteFile: async (filePath) => {
		try {
			await fsp.unlink(filePath);
			console.log("🗑️ File deleted:", filePath);
		} catch (err) {
			console.error("❌📂 Error deleting file:", err);
			throw err;
		}
	},

	deleteFolder: async (folderPath) => {
		try {
			// Check if the folder exists
			if (!fs.existsSync(folderPath)) {
				console.log("❌📂 Folder does not exist:", folderPath);
				return;
			}
			// Read all files and subdirectories in the folder
			const files = await fsp.readdir(folderPath);
			// Loop through each file/subdirectory
			for (const file of files) {
				const filePath = path.join(folderPath, file);
				// Check if it's a directory
				const stat = await fsp.stat(filePath);
				if (stat.isDirectory()) {
					// Recursively delete the subdirectory
					await fileSystem.deleteFolder(filePath);
				} else {
					// Delete the file
					await fsp.unlink(filePath);
					console.log("🗑️ Deleted file:", filePath);
				}
			}
			// Finally, remove the empty folder
			await fsp.rmdir(folderPath);
			console.log("🗑️ Deleted folder:", folderPath);
		} catch (err) {
			console.error("❌📂 Error deleting folder:", err);
			throw err;
		}
	},

	zipFolder: async (folder, outputFilePath) => {
		try {
			const zip = new AdmZip();
			zip.addLocalFolder(folder);

			// Ensure the directory for the zip file exists
			const outputDir = path.dirname(outputFilePath);
			await fs.promises.mkdir(outputDir, { recursive: true });

			// Write the zip file
			zip.writeZip(outputFilePath);

			console.log("✅📂 Folder zipped to", outputFilePath);
		} catch (error) {
			console.error("❌📂 Error zipping folder:", err);
			throw error;
		}
	},

	getSubFilesAndFolders: async (folderPath) => {
		try {
			// Check if the folder exists
			if (!fs.existsSync(folderPath)) {
				console.log("❌📂 Folder does not exist:", folderPath);
				return [];
			}

			// Read all files and subdirectories in the folder
			const items = await fsp.readdir(folderPath, { withFileTypes: true });
			const subFilesAndFolders = [];

			// Loop through each item
			for (const item of items) {
				subFilesAndFolders.push(item.name);
			}

			return subFilesAndFolders;
		} catch (error) {
			console.error("❌📂 Error getting subfiles and folders:", error);
			throw error;
		}
	}
};

module.exports = fileSystem;

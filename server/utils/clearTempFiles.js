const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");
const fileSystem = require("./fileSystem");

function clearTempFiles(folders) {
	// ask user for confirmation

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const folderString = folders.map((folder) => `\`${folder}\``).join(", ");

	rl.question(
		`Are you sure you want to delete the files & folders in the following directories: ${folderString}? (y/n) `,
		async (answer) => {
			if (answer.toLowerCase() !== "y") {
				console.log("❌ Operation cancelled.");
			} else {
				for (const folder of folders) {
					const folderPath = path.join(__dirname, "..", folder);

					try {
						const files = await fs.readdir(folderPath);

						for (const file of files) {
							const filePath = path.join(folderPath, file);
							const stat = await fs.stat(filePath);

							if (stat.isDirectory()) {
								// Recursively delete the subdirectory
								await fileSystem.deleteFolder(filePath);
							} else {
								// Delete the file
								await fileSystem.deleteFile(filePath);
							}
						}
					} catch (err) {
						console.error(`❌ Error reading folder: ${folderPath}`, err);
					}
				}

				console.log("✅ Deletion completed.");
			}
			rl.close();
		}
	);
}

clearTempFiles(["lib/downloads", "lib/uploads", "lib/unzippedWordDocs", "lib/html"]);

const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

function clearTempFiles(folders) {
	// ask user for confirmation

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const folderString = folders.map((folder) => `\`${folder}\``).join(", ");

	rl.question(
		`Are you sure you want to delete files in the folders: ${folderString}? (y/n) `,
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

							try {
								await fs.unlink(filePath);
								console.log(`🗑️ Deleted file: ${filePath}`);
							} catch (err) {
								console.error(`❌ Error deleting file: ${filePath}`, err);
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

clearTempFiles(["downloads", "uploads"]);

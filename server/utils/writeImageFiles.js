const fileSystem = require("./fileSystem");
const mammoth = require("mammoth");

async function writeImageFiles(folderPath, folderName) {
	// create folder if it doesn't exist
	const imageFolderPath = await fileSystem.createFolder(folderPath + "/" + folderName);

	let imageCounter = 0;
	return mammoth.images.imgElement(async (image) => {
		try {
			const buffer = await image.read();
			const ext = image.contentType.split("/").pop();

			const fileName = `image-${imageCounter}.${ext}`;
			const filePath = `${imageFolderPath}/${fileName}`;

			await fileSystem.writeFile(filePath, buffer);

			imageCounter++;
			return {
				src: `${folderName}/${fileName}`
			};
		} catch (error) {
			console.error("Error writing image file:", error);
			throw new Error("Failed to write image file");
		}
	});
}

module.exports = writeImageFiles;

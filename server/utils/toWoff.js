const { spawn } = require("child_process");
const opentype = require("opentype.js");
const fs = require("fs");

async function otfToTtf(inputPath, outputPath) {
	try {
		// Load the OTF font
		const font = await opentype.load(inputPath);

		// Convert to TTF format
		const ttfBuffer = Buffer.from(font.toArrayBuffer());

		// Write the TTF file
		fs.writeFileSync(outputPath, ttfBuffer);

		console.log(`Successfully converted ${inputPath} to ${outputPath}`);
	} catch (error) {
		console.error("Conversion failed:", error);
	}
}

function ttfToWoff(inputPath, outputPath) {
	const command = "ttf2woff";

	const args = [inputPath, outputPath];

	return new Promise((resolve, reject) => {
		const conversionProcess = spawn(command, args);

		conversionProcess.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${command} process exited with code ${code}`));
			}
		});

		conversionProcess.on("error", (error) => {
			reject(error);
		});
	});
}

module.exports = { ttfToWoff, otfToTtf };

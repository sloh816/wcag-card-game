const { spawn } = require("child_process");

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

module.exports = ttfToWoff;

const path = require("path");

/**
 * Simple MIME type detection based on file extension
 * @param {string} fileName - Name of the file
 * @returns {string} - MIME type
 */
function getMimeType(fileName) {
	const ext = path.extname(fileName).toLowerCase();
	const mimeTypes = {
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".png": "image/png",
		".gif": "image/gif",
		".pdf": "application/pdf",
		".txt": "text/plain",
		".doc": "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".mp4": "video/mp4",
		".mp3": "audio/mpeg",
		".woff": "font/woff",
		".woff2": "font/woff2",
		".ttf": "font/ttf",
		".otf": "font/otf"
	};
	return mimeTypes[ext] || "application/octet-stream";
}

module.exports = getMimeType;

function repeatString(string, n, separator = " ") {
	if (n <= 0) {
		return "";
	}
	return Array(n).fill(string).join(separator);
}

function slugify(string) {
	return string
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

module.exports = {
	repeatString,
	slugify
};

const fileSystem = require("../utils/fileSystem");
const cheerio = require("cheerio");

class Html {
	constructor(filePath, html) {
		this.filePath = filePath;
		this.html = html;
	}

	async getHtml() {
		if (!this.html) {
			// Read the HTML file
			const content = await fileSystem.readFile(this.filePath);
			this.html = content;
		}

		return this.html;
	}

	setHtml(html) {
		this.html = html;
	}

	async prependStyles(outputPath) {
		console.log("🔃 Prepending styles:", this.filePath);
		// Read the HTML file
		const content = await this.getHtml();

		// Prepend styles to the HTML content
		const $ = cheerio.load(content);

		// Remove table classes
		$("table, td, tr, th").removeAttr("class");

		// remove classes from div elements
		$("div").each((_, element) => {
			$(element).removeAttr("class");
		});

		// Check the hyperlinks and remove the classes
		$(".Hyperlink").each((_, element) => {
			const parentTag = $(element).parent().get(0).tagName;
			if (parentTag !== "a") {
				const content = $(element).text();
				if (content.startsWith("http")) {
					$(element).wrap(`<a href="${content}"></a>`);
				}
			}
			$(element).removeAttr("class");
		});

		// Tag the footnotes
		$("._idFootnoteAnchor").each((_, element) => {
			const refNumberId = $(element).attr("href").split("#")[1];

			// prepend the reference number with 'ref@__'
			const refNumber = $("#" + refNumberId);
			const refNumberInner = refNumber.html();
			refNumber.html("ref@__" + refNumberInner);

			const parent = $(element).parent();
			const parentText = parent.text();
			$("body").append(`<p class="Footnote">${parentText}</p>`);
		});

		$("._idFootnotes, .HorizontalRule-1").remove();

		// Prepend classes to elements.
		// Separate with $__ for paragraph styles
		// Separate with #__ for character styles
		const prependClasses = (selector, separator, start = "", end = "") => {
			$(selector)
				.toArray() // Convert Cheerio collection to array
				.reverse() // Reverse to process children first
				.forEach((element) => {
					var className = $(element).attr("class");
					if (className && !className.startsWith("_")) {
						const innerHtml = $(element).html();
						$(element).html(start + className + separator + innerHtml + end);
					}
					$(element).removeAttr("class");
				});
		};
		prependClasses("[class]:is(span, em, strong)", "#__", "[[[", "]]]");
		prependClasses("[class]", "$__");

		this.html = $.html();
		this.filePath = outputPath;
		this.writeFile();

		console.log("✅ Prepend styles done:", this.filePath);

		return this.filePath;
	}

	async writeFile() {
		const file = await fileSystem.writeFile(this.filePath, this.html);

		console.log("✅ HTML file written to:", file);
		return file;
	}

	async convertEmfsToPng() {}
}

module.exports = Html;

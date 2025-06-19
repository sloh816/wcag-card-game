const fileSystem = require("../utils/fileSystem");
const cheerio = require("cheerio");
const { slugify } = require("../utils/strings");
const convertTocToNestedList = require("../utils/convertTocToNestedList");

class Html {
	constructor(file, folder, content = null, imagesFolder = null, cssFile = null) {
		this.file = file;
		this.folder = folder;
		this.content = content;
		this.imagesFolder = imagesFolder;
		this.cssFile = cssFile;
	}

	getFilePath() {
		if (this.folder && this.file) {
			return `${this.folder}/${this.file}`;
		}
	}

	async getHtml() {
		if (!this.content) {
			// Read the HTML file
			const content = await fileSystem.readFile(this.getFilePath());
			this.content = content;
		}

		return this.content;
	}

	async prependStyles(outputFolder, outputFileName) {
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

		this.content = $.html();
		this.folder = outputFolder;
		this.file = outputFileName;
		await this.writeFile();

		console.log("✅ Prepend styles done");
	}

	async writeFile() {
		const file = await fileSystem.writeFile(this.getFilePath(), this.content);

		console.log("✅ HTML file written to:", file);
		return file;
	}

	async cleanUpWordToHtml(imageSizes) {
		let $ = cheerio.load(this.content);

		// check if images are a child of a table
		const imagesInTables = [];
		$("img").each((_, img) => {
			const isInTable = $(img).parents("table").length > 0;

			if (!isInTable) {
				// apply the width and height from the imageSizes object
				const imageSize = imageSizes[0];
				if (imageSize) {
					$(img).attr("width", imageSize.width);
					$(img).attr("height", imageSize.height);
				}

				// remove the first item from imageSizes
				imageSizes.shift();
			} else {
				// put the element in another array
				imagesInTables.push(img);
			}
		});

		// Set the width and height for images in tables with the remaining imageSizes
		imagesInTables.forEach((img, index) => {
			const imageSize = imageSizes[index];
			if (imageSize) {
				$(img).attr("width", imageSize.width);
				$(img).attr("height", imageSize.height);
			}
		});

		// Select all <a> tags with an id that starts with '_' and move the id to their parent tag
		$("a[id^=_]").each((_, element) => {
			const id = $(element).attr("id");

			// check if parent has an id that starts with '_'
			const parentId = $(element).parent().attr("id");
			if (parentId && parentId.startsWith("_")) {
				// change the href to the id of the parent
				$(`[href="#${id}"]`).attr("href", "#" + parentId);
			} else {
				$(element).parent().attr("id", id); // Move the id to its parent tag
			}

			$(element).remove();
		});

		// Replace TOC links with cleaner names
		$("[id^=_]").each((index, element) => {
			const currentId = $(element).attr("id");
			const cleanId = index + "_" + slugify($(element).text().trim());
			$(`[href*=#${currentId}]`).each((_, link) => {
				$(link).attr("href", `#${cleanId}`); // Update href attributes
			});
			$(element).attr("id", cleanId);
		});

		// Convert TOC to nested list
		const convertedToc = convertTocToNestedList($.html());
		$ = cheerio.load(convertedToc);

		// Remove page numbers from toc
		$("[class^=toc-] a").each((_, element) => {
			const text = $(element).text();
			const cleanText = text.replace(/[\s\t]*\d+\s*$/, "");
			$(element).text(cleanText);
		});

		// unwrap <img> tags from <p> tags
		$("p > img").each((_, img) => {
			$(img).unwrap();
		});

		// add an aria label to the footnote back button
		$("a[href^=#footnote]").each((_, a) => {
			$(a).attr("aria-label", "Back to endnote reference");
		});

		// wrap the endnotes list in a 'section' tag and add a 'Endnotes' heading
		$("ol:has(li[id*=footnote])").each((_, ol) => {
			$(ol).wrap('<section id="endnotes"></section>');
			$(ol).before('<h2 class="heading-2">Endnotes</h2>');
		});

		//  if table class includes "callout" or "layout", convert to div
		$("table[class*='callout'], table[class*='layout']").each((_, table) => {
			// if table is one cell, convert to one div
			const className = $(table).attr("class");
			if ($(table).find("td, th").length === 1) {
				const cellContent = $(table).html();
				$(table).replaceWith(`<div class="${className}">${cellContent}</div>`);
			} else {
				// if table has multiple cells, convert to nested divs and apply grid styles
				const tableDiv = $("<div></div>").addClass(className);
				$(table)
					.find("tr")
					.each((_, tr) => {
						const rowDiv = $("<div></div>").addClass(className + "__row");

						$(tr)
							.find("td, th")
							.each((_, cell) => {
								const cellDiv = $("<div></div>").addClass(
									className + "__row__cell"
								);
								cellDiv.html($(cell).html());
								rowDiv.append(cellDiv);
							});

						tableDiv.append(rowDiv);
					});

				$(table).after(tableDiv);
				$(table).remove();
			}
		});

		// if the table class includes 'large' or 'wrap', wrap in a div with class 'table-wrapper'
		$("table[class*='large'], table[class*='wrap']").each((_, table) => {
			const tableWrapper = $("<div></div>").addClass("table-wrapper");
			$(table).wrap(tableWrapper);
		});

		// remove empty elements
		$("*:empty:not(img, br, th, td)").remove();

		this.content = $("body").html();
	}

	async zip() {
		const outputZipPath = this.folder.replace("/html", "/downloads") + ".zip";
		await fileSystem.zipFolder(this.folder, outputZipPath);
		return outputZipPath;
	}
}

module.exports = Html;

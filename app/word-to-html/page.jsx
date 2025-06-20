"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Header from "@/components/Header";
import ServerConnection from "@/components/ServerConnection";
import SuccessMessage from "@/components/SuccessMessage";

// Constants
const WORD_DOCUMENT_TYPE =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const FAVICON_TYPES = ["image/png", "image/jpeg", "image/x-icon"];

const WordToHtmlPage = () => {
	// State management
	const [file, setFile] = useState(null);
	const [favicon, setFavicon] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [downloadLink, setDownloadLink] = useState(null);
	const [isConverting, setIsConverting] = useState(false);
	const [showDocumentOptions, setShowDocumentOptions] = useState(false);
	const [fontFiles, setFontFiles] = useState({});
	const [fontsFound, setFontsFound] = useState();
	const [htmlFolder, setHtmlFolder] = useState();

	useEffect(() => {
		document.title = "Word to HTML";
	}, []);

	// Utility functions
	const clearMessages = () => {
		setErrorMessage(null);
		setSuccessMessage(null);
	};

	const validateFile = (file) => {
		if (!file) {
			throw new Error("Please upload a file");
		}
		if (file.type !== WORD_DOCUMENT_TYPE) {
			throw new Error("Please upload a valid Word document (.docx)");
		}
	};

	const validateTemplateOptions = (documentTitle, favicon) => {
		if (!documentTitle?.trim()) {
			throw new Error("Please input a document title");
		}
		if (favicon && !FAVICON_TYPES.includes(favicon.type)) {
			throw new Error("Please upload a valid favicon (png, jpeg, ico)");
		}
	};

	// Event handlers
	const handleFileChange = (event) => {
		clearMessages();
		const selectedFile = event.target.files[0];
		const inputId = event.target.id;

		if (inputId === "file") {
			setFile(selectedFile);
		} else if (inputId === "favicon") {
			setFavicon(selectedFile);
		} else if (inputId.endsWith("font-upload")) {
			const fontSlug = inputId.replace("-font-upload", "");
			setFontFiles((prev) => ({
				...prev,
				[fontSlug]: selectedFile
			}));
		}
	};

	const clearInput = (inputId) => {
		const inputElement = document.getElementById(inputId);
		if (inputElement) {
			inputElement.value = "";
		}

		if (inputId === "file") {
			setFile(null);
		} else if (inputId === "favicon") {
			setFavicon(null);
		}

		clearMessages();
		setDownloadLink(null);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearMessages();

		try {
			validateFile(file);

			const formData = new FormData();
			formData.append("file", file);

			const includeTemplate = document.getElementById("template").checked;
			formData.append("includeTemplate", includeTemplate);

			if (includeTemplate) {
				const documentTitle = document.getElementById("document-title").value;
				validateTemplateOptions(documentTitle, favicon);

				formData.append("documentTitle", documentTitle);
				formData.append("favicon", favicon);
			}

			const generateCss = document.getElementById("generate-css").checked;
			formData.append("generateCss", generateCss);

			setIsConverting(true);
			const response = await api.wordToHtml(formData);

			if (response.status === 200) {
				if (response.data.downloadPath) {
					setSuccessMessage("Word document processed successfully!");
					setDownloadLink(response.data.downloadPath);
				}

				if (response.data.fontsFound) {
					setFontsFound(response.data.fontsFound);
					setHtmlFolder(response.data.htmlFolder);
				}
			}
		} catch (error) {
			console.error("Error uploading file:", error);

			if (error.message) {
				setErrorMessage(error.message);
			} else if (error.response?.data?.error) {
				setErrorMessage(error.response.data.error);
			} else {
				setErrorMessage("An error occurred while uploading the file.");
			}
		} finally {
			setIsConverting(false);
		}
	};

	const toggleEmbedCode = (event) => {
		event.preventDefault();
		const button = event.target;
		const fontItem = button.parentElement.parentElement;

		const uploadFont = fontItem.querySelector(".upload-font");
		uploadFont.classList.toggle("hidden");

		const embedCode = fontItem.querySelector(".embed-code");
		embedCode.classList.toggle("hidden");
	};

	const handleFontUpload = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		const form = event.target;
		const fontItems = form.querySelectorAll("li");
		fontItems.forEach((fontItem) => {
			const fontName = fontItem.querySelector(".font-name").textContent;
			const fontSlug = fontName.toLowerCase().replace(/\s+/g, "-");
			console.log({ fontName });
			const inputs = fontItem.querySelectorAll("input");
			const embedCode = fontItem.querySelector(".embed-code textarea").value;

			inputs.forEach((input) => {
				const inputId = input.id;
			});

			formData.append("embedCode", embedCode);
		});

		formData.append("htmlFolder", htmlFolder);

		console.log("Font upload FormData entries:");
		for (let pair of formData.entries()) {
			console.log(pair[0], pair[1]);
		}
	};

	// Render components
	const renderErrorMessage = () =>
		errorMessage && (
			<p className="bg-grapefruit-20 py-2 px-4 rounded-md mt-4 border border-grapefruit-100">
				{errorMessage}
			</p>
		);

	const renderFileInput = () => (
		<div className="mt-4">
			<input
				type="file"
				accept=".docx"
				className="border-dashed border-navy-100 border-2 p-8 w-full rounded-lg bg-slate-100 cursor-pointer hover:bg-navy-20 transition-all"
				onChange={handleFileChange}
				id="file"
			/>
			<button
				className="text-sm text-slate-600 block ml-auto mt-2"
				onClick={() => clearInput("file")}
				type="button"
			>
				Clear
			</button>
		</div>
	);

	const renderTemplateCheckbox = () => (
		<div className="flex items-center mb-4 gap-2">
			<input
				type="checkbox"
				className="w-4 h-4 cursor-pointer"
				id="template"
				onChange={(e) => setShowDocumentOptions(e.target.checked)}
			/>
			<label htmlFor="template" className="text-charcoal-100 cursor-pointer">
				Include template code
			</label>
		</div>
	);

	const renderDocumentOptions = () =>
		showDocumentOptions && (
			<div className="ml-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-100 p-4 rounded-lg">
				<div className="flex flex-col gap-1">
					<label
						htmlFor="document-title"
						className="text-charcoal-100 cursor-pointer text-sm"
					>
						Document title
					</label>
					<input
						type="text"
						id="document-title"
						className="border border-slate-500 rounded-md px-2 py-1 w-full"
						placeholder="Enter document title"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="favicon" className="text-charcoal-100 cursor-pointer text-sm">
						Favicon
					</label>
					<input
						type="file"
						accept=".png,.jpg,.jpeg,.ico"
						className="border-dashed border-navy-100 border p-4 w-full rounded-lg bg-white cursor-pointer hover:bg-navy-20 transition-all text-sm"
						id="favicon"
						onChange={handleFileChange}
					/>
					<button
						className="text-sm text-slate-600 block ml-auto mt-1"
						onClick={() => clearInput("favicon")}
						type="button"
					>
						Clear
					</button>
				</div>
			</div>
		);

	const renderCheckbox = ({ id, label }) => {
		return (
			<div className="flex items-center my-4 gap-2">
				<input type="checkbox" className="w-4 h-4" id={id} />
				<label htmlFor={id} className="text-charcoal-100 cursor-pointer">
					{label}
				</label>
			</div>
		);
	};

	const renderSubmitButton = () => (
		<button className="button button--grapefruit mt-4" disabled={isConverting} type="submit">
			{isConverting ? "Converting..." : "Convert"}
		</button>
	);

	const renderFontInputs = ({ name }) => {
		const slug = name.toLowerCase().replace(/\s+/g, "-");
		return (
			<div className="bg-slate-200 p-4 rounded-lg">
				<div className="flex items-center justify-between">
					<p className="font-name font-bold w-32">{name}</p>
					<button
						className="text-sm underline text-charcoal-100"
						onClick={toggleEmbedCode}
						type="button"
					>
						Embed code
					</button>
				</div>
				<div className="upload-font flex items-start gap-4 mt-4">
					<div className="flex flex-col gap-1">
						<label
							htmlFor={`${slug}-font-from-directus`}
							className="text-charcoal-100 cursor-pointer text-sm"
						>
							Select a font from the database
						</label>
						<select
							className="w-64 border border-white p-2 rounded-lg bg-white cursor-pointer text-sm"
							id={`${slug}-font-from-directus`}
						>
							<option value="">Select font</option>
							<option value="fs-me-pro-regular">FS Me Pro Regular</option>
							<option value="fs-me-pro-bold">FS Me Pro Bold</option>
						</select>
					</div>
					<p className="self-center mt-4">or</p>
					<div className="flex flex-col gap-1">
						<label htmlFor="font" className="text-charcoal-100 cursor-pointer text-sm">
							Upload a .ttf or .otf file
						</label>
						<input
							type="file"
							accept=".ttf,.otf"
							className="border-dashed border-navy-100 border p-2 rounded-lg bg-white cursor-pointer hover:bg-navy-20 transition-all text-sm"
							id={`${slug}-font-upload`}
							onChange={handleFileChange}
						/>
					</div>
					<div className="flex gap-4 ml-8">
						<div className="self-center mt-5">
							{renderCheckbox({ id: `${slug}-font-bold`, label: "Bold" })}
						</div>
						<div className="self-center mt-5">
							{renderCheckbox({ id: `${slug}-font-italic`, label: "Italic" })}
						</div>
					</div>
				</div>
				<div className="embed-code mt-4 hidden">
					<label htmlFor={`${slug}-embed-code`} className="text-sm text-charcoal-100">
						Embed code
					</label>
					<textarea
						id={`${slug}-embed-code`}
						spellCheck="false"
						rows="3"
						className="w-full font-mono text-xs p-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 resize-y"
					></textarea>
				</div>
			</div>
		);
	};

	return (
		<div className="max-w-4xl mx-auto px-4 mb-20">
			<Header title="Word to HTML" />
			<h1 className="heading-1 mt-40 mb-10">Word to HTML</h1>
			<ServerConnection />

			<div className="text-charcoal-100 mb-8">
				<p>Upload a Word Document (.docx) to convert it into a HTML file.</p>
				<p className="mt-2">Make sure that:</p>
				<ul className="list">
					<li>The Word document is accessible</li>
					<li>All images are 'Inline with text'</li>
				</ul>
			</div>

			<p className="font-bold">Input a Word document below:</p>

			{renderErrorMessage()}

			<form onSubmit={handleSubmit}>
				{renderFileInput()}
				{renderTemplateCheckbox()}
				{renderDocumentOptions()}

				{renderCheckbox({
					id: "generate-css",
					label: "Generate CSS"
				})}

				{renderSubmitButton()}
			</form>

			{successMessage && (
				<SuccessMessage
					downloadLink={downloadLink}
					downloadButtonLabel="Download ZIP"
					message={successMessage}
				/>
			)}

			<div className="mt-8">
				<h2 className="heading-2">Fonts detected</h2>
				<p className="my-4">
					The following fonts have been detected in the Word document.
					<br />
					Please select the relevant fonts from the database or upload the font files to
					add to the HTML:
				</p>
				<form onSubmit={handleFontUpload}>
					<ul className="grid gap-2">
						<li>{renderFontInputs({ name: "FS Me Pro" })}</li>
						<li>{renderFontInputs({ name: "FS Me Pro Bold" })}</li>
						<li>{renderFontInputs({ name: "Helvetica" })}</li>
					</ul>

					<button className="my-8 button button--grapefruit">Add fonts</button>
				</form>
			</div>
		</div>
	);
};

export default WordToHtmlPage;

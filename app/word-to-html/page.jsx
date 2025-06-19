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
				setSuccessMessage("Word document processed successfully!");
				setDownloadLink(response.data.downloadPath);
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
			<div className="ml-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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
						className="border-dashed border-navy-100 border p-4 w-full rounded-lg bg-slate-100 cursor-pointer hover:bg-navy-20 transition-all text-sm"
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

	const renderSubmitButton = () => (
		<button className="button button--grapefruit mt-4" disabled={isConverting} type="submit">
			{isConverting ? "Converting..." : "Convert"}
		</button>
	);

	return (
		<div className="max-w-4xl mx-auto px-4">
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

				<div className="flex items-center my-4 gap-2">
					<input type="checkbox" className="w-4 h-4" id="generate-css" />
					<label htmlFor="generate-css" className="text-charcoal-100 cursor-pointer">
						Generate CSS
					</label>
				</div>

				{renderSubmitButton()}
			</form>

			{successMessage && (
				<SuccessMessage
					downloadLink={downloadLink}
					downloadButtonLabel="Download ZIP"
					message={successMessage}
				/>
			)}
		</div>
	);
};

export default WordToHtmlPage;

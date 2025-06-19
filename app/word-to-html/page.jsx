"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Header from "@/components/Header";
import ServerConnection from "@/components/ServerConnection";
import SuccessMessage from "@/components/SuccessMessage";

const Page = ({}) => {
	const [file, setFile] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [downloadLink, setDownloadLink] = useState(null);
	const [isConverting, setIsConverting] = useState(false);
	const [showDocumentOptions, setShowDocumentOptions] = useState(false);
	const [favicon, setFavicon] = useState(null);

	const wordDocumentType =
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

	// image types for favicon - png, jpeg, ico
	const faviconTypes = ["image/png", "image/jpeg", "image/x-icon"];

	useEffect(() => {
		document.title = "Word to HTML";
	}, []);

	const handleFileChange = (event) => {
		setErrorMessage(null);
		setSuccessMessage(null);

		const selectedFile = event.target.files[0];

		const inputId = event.target.id;

		if (inputId === "file") {
			setFile(selectedFile);
		} else if (inputId === "favicon") {
			setFavicon(selectedFile);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage(null);
		setSuccessMessage(null);

		if (!file) {
			setErrorMessage("Please upload a file");
			return;
		}

		if (file.type !== wordDocumentType) {
			setErrorMessage("Please upload a valid Word document (.docx)");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("file", file);

			const includeTemplate = document.getElementById("template").checked;
			formData.append("includeTemplate", includeTemplate);

			if (includeTemplate) {
				const documentTitle = document.getElementById("document-title").value;

				if (!documentTitle) {
					setErrorMessage("Please input a document title");
					return;
				}

				if (!favicon) {
					setErrorMessage("Please upload a favicon");
					return;
				}

				if (!faviconTypes.includes(favicon.type)) {
					setErrorMessage("Please upload a valid favicon (png, jpeg, ico)");
					return;
				}

				formData.append("documentTitle", documentTitle);
				formData.append("favicon", favicon);
			}

			setIsConverting(true);
			const response = await api.wordToHtml(formData);

			if (response.status === 200) {
				setIsConverting(false);
				setSuccessMessage("Word document processed successfully!");
				setDownloadLink(response.data.downloadPath);
			}
		} catch (error) {
			console.log("Error uploading file:", error);
			if (error.response && error.response.data) {
				setErrorMessage(error.response.data.error);
			} else {
				setErrorMessage("An error occurred while uploading the file.");
			}
			setIsConverting(false);
		}
	};

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
			{errorMessage && (
				<p className="bg-grapefruit-20 py-2 px-4 rounded-md mt-4 border border-grapefruit-100">
					{errorMessage}
				</p>
			)}

			<form onSubmit={handleSubmit}>
				<input
					type="file"
					accept=".docx"
					className="border-dashed border-navy-100 border-2 p-8 w-full rounded-lg bg-slate-100 mt-4 cursor-pointer hover:bg-navy-20 transition-all"
					onChange={handleFileChange}
					id="file"
				/>

				<div className="flex items-center my-4 gap-2">
					<input
						type="checkbox"
						className="w-4 h-4 cursor-pointer"
						id="template"
						onChange={() => setShowDocumentOptions(!showDocumentOptions)}
					/>
					<label htmlFor="template" className="text-charcoal-100 cursor-pointer">
						Include template code
					</label>
				</div>

				{showDocumentOptions && (
					<div className="ml-8 mb-8 grid grid-cols-2 gap-8">
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
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor="document-title"
								className="text-charcoal-100 cursor-pointer text-sm shrink-0"
							>
								Favicon
							</label>
							<input
								type="file"
								className="border-dashed border-navy-100 border p-4 w-full rounded-lg bg-slate-100 cursor-pointer hover:bg-navy-20 transition-all text-sm"
								id="favicon"
								onChange={handleFileChange}
							/>
						</div>
					</div>
				)}

				<div className="flex items-center my-4 gap-2">
					<input type="checkbox" className="w-4 h-4" id="generate-css" disabled />
					<label htmlFor="generate-css" className="text-slate-400">
						Generate CSS
					</label>
				</div>

				{!isConverting && (
					<button className="button button--grapefruit mt-4">Convert</button>
				)}
				{isConverting && (
					<span className="button button--grapefruit mt-4">Converting...</span>
				)}
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

export default Page;

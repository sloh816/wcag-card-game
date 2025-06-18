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
	const wordDocumentType =
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

	useEffect(() => {
		document.title = "Word to HTML";
	}, []);

	const handleFileChange = (event) => {
		setErrorMessage(null);
		setSuccessMessage(null);
		setFile(null);

		const selectedFile = event.target.files[0];

		if (selectedFile) {
			if (selectedFile.type !== wordDocumentType) {
				setErrorMessage("Please upload a valid Word document (.docx)");
				return;
			}

			setFile(selectedFile);
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
			setIsConverting(true);
			const formData = new FormData();
			formData.append("file", file);
			formData.append("includeTemplate", document.getElementById("template").checked);

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
				/>

				<div className="flex items-center my-4 gap-2">
					<input type="checkbox" className="w-4 h-4 cursor-pointer" id="template" />
					<label htmlFor="template" className="text-charcoal-100 cursor-pointer">
						Include template code
					</label>
				</div>

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

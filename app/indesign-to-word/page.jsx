"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import DownloadIcon from "@mui/icons-material/Download";
import Header from "@/components/Header";
import ServerConnection from "@/components/ServerConnection";
import SuccessMessage from "@/components/SuccessMessage";

const Page = ({}) => {
	const [file, setFile] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [downloadLink, setDownloadLink] = useState(null);
	const htmlDocType = "text/html";

	useEffect(() => {
		document.title = "InDesign to Word";
	});

	const handleFileChange = (event) => {
		setErrorMessage(null);
		setSuccessMessage(null);
		setFile(null);

		const selectedFile = event.target.files[0];
		if (selectedFile) {
			if (selectedFile.type !== htmlDocType) {
				setErrorMessage("Please upload a valid HTML file (.html)");
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

		if (file.type !== htmlDocType) {
			setErrorMessage("Please upload a valid HTML file (.html)");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("file", file);
			const response = await api.prependStyles(formData);
			console.log("Response:", response);
			if (response.status === 200) {
				setSuccessMessage("HTML processed successfully!");
				setDownloadLink(response.data.downloadPath);
			}
		} catch (error) {
			console.error("Error uploading file:", error);
			setErrorMessage("An error occurred while uploading the file.");
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4">
			<Header title="InDesign to Word" />
			<h1 className="heading-1 mt-40 mb-10">Prepend Word Styles</h1>
			<ServerConnection />
			<div className="text-charcoal-100 mb-8">
				<p>
					After you've exported you InDesign file to HTML, you can use this tool to
					prepend the Word styles.
				</p>
				<p>
					This will prepend the class names to the start of each element in the HTML. It
					will also mark character styles and footnotes.
				</p>
				<p>
					Once processed, you can copy the text into a Word document and run a macro to
					apply the Word Styles.
				</p>
			</div>

			<p className="font-bold">Input a HTML file exported from InDesign below:</p>
			{errorMessage && (
				<p className="bg-grapefruit-20 py-2 px-4 rounded-md mt-4 border border-grapefruit-100">
					{errorMessage}
				</p>
			)}

			<form onSubmit={handleSubmit}>
				<input
					type="file"
					accept=".html"
					className="border-dashed border-navy-100 border-2 p-8 w-full rounded-lg bg-slate-100 mt-4 cursor-pointer hover:bg-navy-20 transition-all"
					onChange={handleFileChange}
				/>
				<button className="button button--grapefruit mt-4">Convert</button>
			</form>

			{successMessage && (
				<SuccessMessage
					downloadLink={downloadLink}
					downloadButtonLabel="Download HTML File"
					message={successMessage}
				/>
			)}
		</div>
	);
};

export default Page;

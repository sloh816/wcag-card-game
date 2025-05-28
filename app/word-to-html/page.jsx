"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import DownloadIcon from "@mui/icons-material/Download";
import Header from "@/components/Header";

const Page = ({}) => {
	const [file, setFile] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [serverConnection, setServerConnection] = useState("checking");
	const [downloadLink, setDownloadLink] = useState(null);

	const checkConnection = async () => {
		try {
			await api.checkConnection();
			setServerConnection(true);
		} catch (error) {
			setServerConnection(false);
			console.log("Error checking connection:", error);
		}
	};

	useEffect(() => {
		document.title = "Word to HTML";
		checkConnection();
	}, []);

	const handleFileChange = (event) => {
		setErrorMessage(null);
		setSuccessMessage(null);
		setFile(null);

		const selectedFile = event.target.files[0];
		if (selectedFile) {
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
			<Header title="Word to HTML" />
			<h1 className="heading-1 mt-40 mb-10">Word to HTML</h1>
			{serverConnection === "checking" && (
				<p className="bg-honey-20 py-2 px-4 rounded-md mt-4 border border-honey-100 mb-8">
					Checking server connection...
				</p>
			)}
			{!serverConnection && (
				<p className="bg-grapefruit-20 py-2 px-4 rounded-md mt-4 border border-grapefruit-100 mb-8">
					Server is not reachable 😭😭😭 Please start the server (or ask Shannon to, she
					probably forgot lmao)
				</p>
			)}
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
					accept=".html"
					className="border-dashed border-navy-100 border-2 p-8 w-full rounded-lg bg-slate-100 mt-4 cursor-pointer hover:bg-navy-20 transition-all"
					onChange={handleFileChange}
				/>
				<button className="button button--grapefruit mt-4">Convert</button>
			</form>

			{successMessage && (
				<div className="bg-teal-20 py-2 px-4 rounded-md border border-teal-100 mt-8">
					<p>{successMessage}</p>

					{downloadLink && (
						<a className="button button--navy mt-2" href={downloadLink} download={true}>
							<DownloadIcon />
							Download HTML file
						</a>
					)}
				</div>
			)}
		</div>
	);
};

export default Page;

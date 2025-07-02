"use client";
import Header from "@/components/Header";
import ServerConnection from "@/components/ServerConnection";
import api from "@/lib/api";
import { useEffect, useState } from "react";

const Page = ({}) => {
	const [files, setFiles] = useState(null);
	const [selectedFolders, setSelectedFolders] = useState([]);

	const getServerFiles = async () => {
		try {
			const response = await api.getServerFiles();
			setFiles(response);
		} catch (error) {
			console.error("Error fetching server files:", error);
		}
	};

	useEffect(() => {
		getServerFiles();
	}, []);

	const deleteServerFiles = async (selection) => {
		const folders =
			selection === "all" ? files.map((folder) => folder.folder) : selectedFolders;

		try {
			const response = await api.deleteServerFiles(folders);

			if (response.status === 200) {
				getServerFiles();
			}

			// reset selected folders
			setSelectedFolders([]);

			// uncheck all checkboxes
			const inputs = document.querySelectorAll("input[type='checkbox']");
			inputs.forEach((input) => {
				input.checked = false;
			});
		} catch (error) {
			console.error("Error deleting server files:", error);
		}
	};

	const selectFolder = (event) => {
		const folder = event.target.value;
		if (event.target.checked) {
			if (!selectedFolders.includes(folder)) {
				setSelectedFolders([...selectedFolders, folder]);
			}
		} else {
			const updatedFolders = selectedFolders.filter((f) => f !== folder);
			setSelectedFolders(updatedFolders);
		}
	};

	return (
		<div>
			<Header title="Admin" />

			<div className="mt-28 max-w-4xl ml-8 mb-16">
				<h1 className="text-lg font-bold mb-4 text-navy-100">Server library files</h1>
				<ServerConnection />
				{files && (
					<>
						<div className="flex items-center gap-2 ">
							<button
								className="button button--grapefruit mt-2 mb-4"
								onClick={() => deleteServerFiles("all")}
							>
								Delete all files
							</button>

							{selectedFolders.length > 0 && (
								<button
									className="button button--grapefruit mt-2 mb-4"
									onClick={() => deleteServerFiles("selected")}
								>
									Delete files in selected folders
								</button>
							)}
						</div>

						<ul className="text-sm">
							{files &&
								files.map((folder) => {
									return (
										<li key={folder.folder} className="mt-2 font-bold ">
											<div className="border-b border-slate-500 flex items-center p-1 gap-1">
												<input
													type="checkbox"
													className="w-4 h-4"
													onChange={selectFolder}
													value={folder.folder}
												/>
												📁 {folder.folder}{" "}
												<span className="text-slate-600 font-normal">
													({folder.files.length} files)
												</span>
											</div>
											<ul className="font-normal">
												{folder.files.map((file, index) => {
													if (index % 2 === 0) {
														return (
															<li key={file} className="ml-6">
																{file}
															</li>
														);
													} else {
														return (
															<li
																key={file}
																className="ml-6 bg-slate-100"
															>
																{file}
															</li>
														);
													}
												})}
											</ul>
										</li>
									);
								})}
						</ul>
					</>
				)}
			</div>
		</div>
	);
};

export default Page;

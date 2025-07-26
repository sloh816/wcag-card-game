"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

const ServerConnection = ({}) => {
	const [serverConnection, setServerConnection] = useState("checking");

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
		checkConnection();
	}, []);

	return (
		<>
			{serverConnection === "checking" && (
				<div className="image-bg h-screen w-screen grid place-items-center fixed top-0 left-0 z-20">
					{<p>Checking server connection...</p>}
				</div>
			)}
			{!serverConnection && (
				<div className="image-bg h-screen w-screen grid place-items-center fixed top-0 left-0 z-20">
					<p>There is a problem with the server...</p>
				</div>
			)}
		</>
	);
};

export default ServerConnection;

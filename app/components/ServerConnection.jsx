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
		<div>
			{serverConnection === "checking" && (
				<p className="bg-orange-100 py-2 px-4 rounded-md mt-4 border border-orange-300 mb-8">
					Checking server connection...
				</p>
			)}
			{!serverConnection && (
				<p className="bg-red-100 py-2 px-4 rounded-md mt-4 border border-red-300 mb-8">
					Server is not reachable 😭😭😭 Please start the server.
				</p>
			)}
		</div>
	);
};

export default ServerConnection;

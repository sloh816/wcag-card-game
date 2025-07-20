"use client";
import { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import ServerConnection from "./components/ServerConnection";
import api from "./lib/api";
import Button from "./components/Button";

const HomePage = ({}) => {
	const [nickname, setNickname] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [error, setError] = useState("");

	const joinRoom = async (action) => {
		action = action || "join";

		if (!nickname) {
			setError("Please enter a valid nickname");
			return;
		}

		if (action === "create") {
			const newRoomId = await api.createRoom();
			goToRoom(newRoomId);
		} else {
			const newRoomCode = roomCode.trim().toUpperCase();
			if (!newRoomCode || newRoomCode.length !== 4) {
				setError("Please enter a valid room code");
				return;
			}
			goToRoom(newRoomCode);
		}
	};

	const goToRoom = (code) => {
		const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/room/${code}?nickname=${nickname}`;
		window.location.href = url;
	};

	return (
		<div className="bg-sky-50 h-screen grid place-items-center">
			<main className="max-w-80 w-full mx-auto p-4">
				<h1 className="font-bold text-3xl text-center">WCAG Card Game</h1>
				<ServerConnection />
				<form className="mt-10 flex flex-col items-stretch gap-4">
					<TextInput
						value={nickname}
						label="Enter your nickname"
						changeFunction={setNickname}
						name="nickname"
					/>

					<TextInput
						value={roomCode}
						label="Enter a room code"
						changeFunction={setRoomCode}
						name="roomCode"
					/>

					{error && (
						<p className="text-red-600 bg-red-100 border border-red-300 px-2 py-1 rounded-lg font-bold text-sm">
							{error}
						</p>
					)}

					<div className="flex flex-col gap-4 mt-4">
						<Button label="Join room" onClickFunc={() => joinRoom()} />
						<Button
							label="Create a room"
							onClickFunc={() => joinRoom("create")}
							styleType="secondary"
						/>
					</div>
				</form>
			</main>
		</div>
	);
};

export default HomePage;

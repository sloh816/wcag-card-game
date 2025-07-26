"use client";
import { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import api from "./lib/api";
import Button from "./components/Button";
import { useSearchParams } from "next/navigation";
import Logo from "./components/Logo";

const HomePage = ({}) => {
	const [nickname, setNickname] = useState("");
	const [error, setError] = useState("");
	const searchParams = useSearchParams();

	const createRoom = async () => {
		if (!nickname) {
			setError("Please enter a valid nickname");
			return;
		}

		const roomId = await api.createRoom();

		// save nickname and room number to local storage
		const roomData = { roomId: roomId, nickname: nickname };
		localStorage.setItem("roomData", JSON.stringify(roomData));

		// go to room
		const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/room/${roomId}`;
		window.location.href = url;
	};

	useEffect(() => {
		const errorParam = searchParams.get("error");
		if (errorParam) {
			setError(errorParam);
		}

		// clear nickname from session storage
		sessionStorage.removeItem("nickname");
	}, [searchParams]);

	return (
		<div className="h-screen grid place-items-center">
			<main className="max-w-80 w-full mx-auto p-4 mb-4">
				<Logo />
				<form className="mt-10 mb-8 flex flex-col items-stretch gap-4">
					{error && (
						<p className="text-red-600 bg-red-100 border border-red-300 px-2 py-1 rounded-md font-bold text-sm">
							{error}
						</p>
					)}
					<TextInput
						value={nickname}
						label="Enter your nickname"
						changeFunction={setNickname}
						name="nickname"
					/>
					<div className="flex flex-col gap-6 mt-4">
						<Button onClickFunc={() => createRoom()} styleType="secondary">
							Create a room
						</Button>
					</div>
				</form>
			</main>
		</div>
	);
};

export default HomePage;

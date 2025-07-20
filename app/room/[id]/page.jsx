"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "../../lib/api";
import Button from "@/components/Button";

const Page = ({}) => {
	const { id } = useParams();
	const searchParams = useSearchParams();
	const nickname = searchParams.get("nickname");
	const [roomExists, setRoomExists] = useState(false);
	const [startGameError, setStartGameError] = useState("");
	const [room, setRoom] = useState(null);

	useEffect(() => {
		console.log({ id, nickname });

		if (!id || !nickname) {
			console.error("Room ID or nickname is missing");
			return;
		}

		async function joinRoom() {
			try {
				const response = await api.joinRoom(id, nickname);
				if (response.error) {
					setRoomExists(false);
				}
			} catch (error) {
				console.error("Error joining room:", error);
			}
		}

		joinRoom();

		const socket = api.getSocket();

		socket.on("room data", (roomData) => {
			setRoom(roomData);
			setRoomExists(true);
			setStartGameError("");
			console.log("Room data received:", roomData);
		});
	}, []);

	const createRoom = async () => {
		try {
			await api.createRoom(id);
			await api.joinRoom(id, nickname);
		} catch (error) {
			console.error("Error creating room:", error);
			setStatus("Failed to create room. Please try again later.");
			return;
		}
	};

	const startGame = () => {
		// check if any players are disconnected
		if (room.players.some((player) => !player.socketId)) {
			setStartGameError(
				"One or more players have disconnected. Please wait for them to reconnect or remove them from the room."
			);
		} else {
			console.log("Starting game...");
		}
	};

	return (
		<div className="bg-sky-50 h-screen">
			<main className="max-w-96 w-full mx-auto p-4">
				{!roomExists ? (
					<>
						<h1 className="text-center text-2xl mt-16 font-bold">
							Room {id} does not exist
						</h1>
						<div className="mt-8">
							<Button label="Create this room" onClickFunc={createRoom} />
						</div>
					</>
				) : (
					<>
						<h1 className="text-center text-2xl mt-16 font-bold">
							Your room code: {id}
						</h1>
						<p className="mt-8">Players in the room:</p>
						{room && room.players.length > 0 ? (
							<ul className="list-disc ml-8 mt-2">
								{room.players.map((player) => {
									return (
										<li key={player.name}>
											{player.name}
											{player.name === room.admin.name && (
												<span> (Admin)</span>
											)}
											{player.name === nickname && <span> (You)</span>}
											{!player.socketId && <span> (Disconnected)</span>}
										</li>
									);
								})}
							</ul>
						) : (
							<p>No players in the room yet</p>
						)}

						{room && !room.gameStarted && nickname === room.admin.name && (
							<div className="mt-8">
								<Button label="Start Game" onClickFunc={startGame} />
								{startGameError && (
									<p className="bg-red-50 text-red-700 p-2 border border-red-400 rounded-lg mt-2 text-sm font-bold">
										{startGameError}
									</p>
								)}
							</div>
						)}
					</>
				)}
			</main>
		</div>
	);
};

export default Page;

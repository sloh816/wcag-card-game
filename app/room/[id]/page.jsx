"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "../../lib/api";
import Button from "@/components/Button";
import Game from "@/components/Game";
import { Room } from "@mui/icons-material";

const Page = ({}) => {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const nickname = searchParams.get("nickname");
    const [roomExists, setRoomExists] = useState(false);
	const [cannotJoin, setCannotJoin] = useState(false);
    const [startGameError, setStartGameError] = useState("");
    const [room, setRoom] = useState(null);

	const joinRoom = async () => {
		try {
			const response = await api.joinRoom(id, nickname);
			if (response.roomNotFound) {
				setRoomExists(false);
				return;
			} else if (response.gameStarted) {
				setRoomExists(true);
				setCannotJoin(true);
				return;
			}
		} catch (error) {
			console.error("Error joining room:", error);
		}
	};

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

	const startGame = async () => {
		// check if there are more than one player in the room
		if (room.players.length < 2) {
			setStartGameError("Must have at least 2 players to start the game.");
		} else {
			await api.startGame(id);
		}
	};

	useEffect(() => {
		console.log({ id, nickname });

		if (!id || !nickname) {
			console.error("Room ID or nickname is missing");
			return;
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

    return (
        <div className="h-screen">
            <main className="max-w-96 w-full mx-auto p-4">
                {!roomExists ? (
                    <>
                        <h1 className="text-center text-2xl mt-16 font-bold">Room {id} does not exist</h1>
                        <div className="mt-8">
                            <Button label="Create this room" onClickFunc={createRoom} />
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-center text-2xl mt-16 font-bold">Your room code: {id}</h1>
                        <p className="mt-8">Players in the room:</p>
                        {room && room.players.length > 0 ? (
                            <ul className="list-disc ml-8 mt-2">
                                {room.players.map((player) => {
                                    return (
                                        <li key={player.name}>
                                            {player.name}
                                            {player.name === room.admin.name && <span> (Admin)</span>}
                                            {player.name === nickname && <span> (You)</span>}
                                            {!player.socketId && <span> (Disconnected)</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No players in the room yet</p>
                        )}

	const StartGameButton = () => {
		return (
			room &&
			!room.gameStarted &&
			nickname === room.admin.name && (
				<div className="mt-8 flex flex-col gap-2">
					<Button label="Start Game" onClickFunc={startGame} />
					{startGameError && (
						<p className="bg-red-50 text-red-700 p-2 border border-red-400 rounded-lg mt-2 text-sm font-bold">
							{startGameError}
						</p>
					)}
				</div>
			)
		);
	};

	const RoomDoesNotExist = () => {
		return (
			<main className="max-w-96 w-full mx-auto p-4">
				<div>
					<h1 className="text-center text-2xl mt-16 font-bold">
						Room {id} does not exist
					</h1>
					<div className="mt-8">
						<Button label="Create this room" onClickFunc={createRoom} />
					</div>
				</div>
			</main>
		);
	};

	const RoomOpen = () => {
		return !room.gameStarted ? (
			<main className="max-w-96 w-full mx-auto p-4">
				<div>
					<h1 className="text-center text-2xl mt-16 font-bold">Your room code: {id}</h1>
					<PlayersList />
					<StartGameButton />
					<a
						href="/"
						className="underline text-cyan-800 text-center mt-4 hover:no-underline block"
					>
						Leave room
					</a>
				</div>
			</main>
		) : (
			<Game room={room} playerName={nickname} />
		);
	};

	const CannotJoinRoom = () => {
		return (
			<main className="max-w-96 w-full mx-auto p-4">
				<div>
					<h1 className="text-center text-2xl mt-16 font-bold">Room code: {id}</h1>
					<p className="text-center mt-4">Game has already Started. Cannot join.</p>
					<a
						href="/"
						className="underline text-cyan-800 text-center mt-4 hover:no-underline block"
					>
						Back to home
					</a>
				</div>
			</main>
		);
	};

	return (
		<div className="bg-sky-50 h-screen">
			{!roomExists ? <RoomDoesNotExist /> : !cannotJoin ? <RoomOpen /> : <CannotJoinRoom />}
		</div>
	);
};

export default Page;

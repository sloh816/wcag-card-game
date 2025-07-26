"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "../../lib/api";
import Button from "@/components/Button";
import Game from "@/components/Game";
import TextInput from "@/components/TextInput";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import Logo from "@/components/Logo";

const Page = ({}) => {
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [gameInProgressCannotJoin, setGameInProgressCannotJoin] = useState(false);
	const [showJoinForm, setShowJoinForm] = useState(false);
	const [showGame, setShowGame] = useState(false);
	const [showLobby, setShowLobby] = useState(false);
	const [room, setRoom] = useState(null);
	const [nickname, setNickname] = useState("");
	const [startGameError, setStartGameError] = useState("");
	const [alreadyConnected, setAlreadyConnected] = useState(false);

	const checkIfRoomExists = async (roomCode) => {
		try {
			const response = await api.getRoomData(roomCode);

			// if room doesn't exist, redirect to home with error
			if (response.roomNotFound) {
				window.location.href = "/?error=Room not found";
				setIsLoading(false);
				return;
			}

			// if room exists,
			if (response.id) {
				// get code and nickname from local storage
				const storedRoomData = localStorage.getItem("roomData");
				const storedNickname = storedRoomData ? JSON.parse(storedRoomData).nickname : "";
				const storedRoomId = storedRoomData ? JSON.parse(storedRoomData).roomId : "";

				// if user was already in the room, join the room
				if (storedRoomId === id && storedNickname) {
					joinRoom(id, storedNickname, response);
					return;
				}

				// if no nickname, check if game has started
				if (response.gameStarted) {
					setIsLoading(false);
					setGameInProgressCannotJoin(true);
				} else {
					setIsLoading(false);
					setShowJoinForm(true);
				}
			}
		} catch (error) {
			console.error("Error fetching room data:", error);
			return null;
		}
	};

	const joinRoom = async (id, nickname, roomData) => {
		try {
			console.log("=== CLIENT JOIN ROOM DEBUG ===");
			console.log("Room ID:", id);
			console.log("Nickname:", nickname);
			console.log("Room Data:", roomData);
			console.log("Game Started:", roomData?.gameStarted);

			const response = await api.joinRoom(id, nickname);
			console.log("Join room response:", response);
			console.log("Response type:", typeof response);
			console.log("Response keys:", Object.keys(response));

			if (response.success) {
				console.log("SUCCESS: Joining room");
				// Store the nickname and room data
				setNickname(nickname);
				localStorage.setItem("roomData", JSON.stringify({ nickname, roomId: id }));

				setIsLoading(false);
				setAlreadyConnected(false);

				if (roomData && roomData.gameStarted) {
					console.log("Game already started - showing game");
					setShowGame(true);
					setShowJoinForm(false);
					setShowLobby(false);
				} else {
					console.log("Game not started - showing lobby");
					setShowLobby(true);
					setShowJoinForm(false);
					setShowGame(false);
				}
			} else if (response.error === "Player already connected") {
				console.log("ERROR: Player already connected");
				// Player is already connected in another tab/window
				setIsLoading(false);
				setAlreadyConnected(true);
				setShowJoinForm(false);
				setShowLobby(false);
				setShowGame(false);
				setGameInProgressCannotJoin(false);
			} else {
				// Handle other error cases
				console.log("ERROR: Other error", response);
				console.error(
					"Failed to join room:",
					response.error || response.message || "Unknown error"
				);
				setIsLoading(false);
				// You might want to show an error message to the user here
			}
			console.log("=== END CLIENT JOIN ROOM DEBUG ===");
		} catch (error) {
			console.error("Error joining room:", error);
			setIsLoading(false);
		}
	};

	const startGame = async () => {
		// check if there are more than one player in the room
		if (room.players.length < 2) {
			setStartGameError("Must have at least 2 players to start the game.");
		} else {
			setStartGameError("");
			await api.startGame(id);
			// Don't manually set UI state - let the socket update handle it
			// The server will emit updated room data with gameStarted: true
		}
	};

	// Helper function to check if current player is in the room
	const isPlayerInRoom = (roomData, playerNickname) => {
		if (!roomData || !playerNickname) return false;
		return roomData.players.some((player) => player.name === playerNickname);
	};

	// Helper function to update UI state based on room and player status
	const updateUIState = (roomData, playerNickname) => {
		if (!roomData) return;

		const playerInRoom = isPlayerInRoom(roomData, playerNickname);

		// Reset already connected state when updating UI
		setAlreadyConnected(false);

		if (roomData.gameStarted) {
			if (playerInRoom) {
				// Player is in room and game has started - show game
				setShowGame(true);
				setShowLobby(false);
				setShowJoinForm(false);
				setGameInProgressCannotJoin(false);
			} else {
				// Player is not in room and game has started - cannot join
				setShowGame(false);
				setShowLobby(false);
				setShowJoinForm(false);
				setGameInProgressCannotJoin(true);
			}
		} else {
			if (playerInRoom) {
				// Player is in room and game hasn't started - show lobby
				setShowGame(false);
				setShowLobby(true);
				setShowJoinForm(false);
				setGameInProgressCannotJoin(false);
			} else {
				// Player is not in room and game hasn't started - show join form
				setShowGame(false);
				setShowLobby(false);
				setShowJoinForm(true);
				setGameInProgressCannotJoin(false);
			}
		}
	};

	useEffect(() => {
		if (!id) {
			window.location.href = "/";
			return;
		}

		// Get stored nickname if available
		const storedRoomData = localStorage.getItem("roomData");
		const storedNickname = storedRoomData ? JSON.parse(storedRoomData).nickname : "";
		if (storedNickname) {
			setNickname(storedNickname);
		}

		// check if room exists
		if (id) {
			checkIfRoomExists(id);
		}

		// retrieve room data from socket
		const socket = api.getSocket();

		const handleRoomData = (roomData) => {
			if (roomData) {
				console.log(roomData);
				setRoom(roomData);

				// Update UI state based on current room data and player status
				const currentNickname = nickname || storedNickname;
				if (currentNickname) {
					updateUIState(roomData, currentNickname);
				}
			}
		};

		socket.on("room data", handleRoomData);

		// Cleanup socket listener
		return () => {
			socket.off("room data", handleRoomData);
		};
	}, [id]); // Remove nickname from dependencies

	// Separate useEffect to handle nickname changes
	useEffect(() => {
		if (room && nickname) {
			updateUIState(room, nickname);
		}
	}, [nickname, room]); // This will update UI when nickname changes

	const StartGameButton = () => {
		return (
			room &&
			room.admin &&
			!room.gameStarted &&
			nickname === room.admin.name && (
				<div className="flex flex-col gap-2">
					<Button onClickFunc={startGame} styleType="primary">
						Start Game
					</Button>
					{startGameError && (
						<p className="bg-red-50 text-red-700 p-2 border border-red-400 rounded-lg mt-2 text-sm font-bold">
							{startGameError}
						</p>
					)}
				</div>
			)
		);
	};

	const PlayersList = () => {
		return (
			<div className="my-8">
				<h2 className="text-xl font-bold mb-4">Players in the room:</h2>
				<ul className="list-disc pl-5">
					{room &&
						room.players.map((player) => {
							const isAdmin = room.admin && player.name === room.admin.name;
							const isCurrentPlayer = player.name === nickname;
							return (
								<li key={player.name} className="text-lg">
									{player.name} {isAdmin ? "(Admin)" : ""}{" "}
									{isCurrentPlayer ? "(You)" : ""}
								</li>
							);
						})}
				</ul>
			</div>
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

	const AlreadyConnected = () => {
		const handleRefresh = () => {
			window.location.reload();
		};

		const handleGoHome = () => {
			// Clear localStorage to allow rejoining
			localStorage.removeItem("roomData");
			window.location.href = "/";
		};

		return (
			<main className="max-w-96 w-full mx-auto p-4">
				<div className="text-center mt-16">
					<Logo width="200" />
					<h1 className="text-2xl font-bold mb-4 mt-8">Already Playing</h1>
					<div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
						<p className="text-yellow-800 font-medium">
							You are already connected to this room in another tab or window.
							<span className="block mt-2 text-sm">
								Please close the other tab/window or use one of the options below:
							</span>
						</p>
					</div>
					<div className="flex flex-col gap-3">
						<Button onClickFunc={handleRefresh} styleType="primary">
							Refresh Page
						</Button>
						<Button onClickFunc={handleGoHome} styleType="secondary">
							Go to Home
						</Button>
					</div>
				</div>
			</main>
		);
	};

	const JoinForm = () => {
		const [localNickname, setLocalNickname] = useState("");
		const [error, setError] = useState("");
		const [isJoining, setIsJoining] = useState(false);

		const handleJoinRoom = async () => {
			if (isJoining) return; // Prevent double clicks

			const playersInRoom = room ? room.players : [];
			// if nickname is the same as a player.name, show error
			if (playersInRoom.some((player) => player.name === localNickname)) {
				setError("Nickname already taken. Please choose a different nickname.");
				return;
			}

			if (!localNickname) {
				setError("Please enter a valid nickname");
				return;
			}

			setError("");
			setIsJoining(true);
			setIsLoading(true); // Show loading while trying to join

			try {
				await joinRoom(id, localNickname, room);
			} finally {
				setIsJoining(false);
			}
		};

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
							value={localNickname}
							label="Enter your nickname"
							changeFunction={setLocalNickname}
							name="nickname"
						/>
						<div className="flex flex-col gap-6 mt-4">
							<Button
								onClickFunc={() => handleJoinRoom()}
								styleType="primary"
								disabled={isJoining}
							>
								{isJoining ? "Joining..." : "Join room"}
							</Button>
						</div>
					</form>
				</main>
			</div>
		);
	};

	const Lobby = () => {
		const [copied, setCopied] = useState(false);

		const copyLink = () => {
			const roomUrl = window.location.href;
			navigator.clipboard.writeText(roomUrl).then(() => {
				setCopied(true);
			});
		};

		return (
			<div className="h-screen mt-20">
				<main className="max-w-80 w-full mx-auto p-4 mb-4">
					<Logo />
					<PlayersList />
					{room && room.admin && room.admin.name === nickname && <StartGameButton />}
					<div className="mt-4">
						<Button styleType="secondary" onClickFunc={() => copyLink()}>
							<InsertLinkIcon />
							<span className="ml-2">Invite</span>
						</Button>
						{copied && (
							<p className="bg-amber-200 text-amber-700 p-2 border border-amber-400 rounded-full mt-2 text-sm font-bold text-center">
								Room link copied to clipboard!
							</p>
						)}
					</div>
				</main>
			</div>
		);
	};

	return (
		<div className="h-screen">
			{isLoading ? (
				<div className="flex justify-center items-center h-screen">
					<p className="text-center">Loading...</p>
				</div>
			) : (
				<>
					{alreadyConnected && <AlreadyConnected />}
					{gameInProgressCannotJoin && <CannotJoinRoom />}
					{showJoinForm && <JoinForm />}
					{showLobby && <Lobby />}
					{showGame && room && <Game room={room} playerName={nickname} />}
				</>
			)}
		</div>
	);
};

export default Page;

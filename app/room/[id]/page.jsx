"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "../../lib/api";
import Button from "@/components/Button";
import Game from "@/components/Game";
import WcagLogo from "../../assets/wcag-card-game-logo.png";
import TextInput from "@/components/TextInput";
import InsertLinkIcon from "@mui/icons-material/InsertLink";

const Page = ({}) => {
    const { id } = useParams();
    const [nickname, setNickname] = useState("");
    const [gameInProgressCannotJoin, setGameInProgressCannotJoin] = useState(false);
    const [startGameError, setStartGameError] = useState("");
    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [showLobby, setShowLobby] = useState(false);

    const getRoomData = async (roomCode) => {
        try {
            const response = await api.getRoomData(roomCode);
            if (response.id) {
                setRoom(response);
                setIsLoading(false);
                setShowJoinForm(true);

                if (response.gameStarted) {
                    setGameInProgressCannotJoin(true);
                    setShowJoinForm(false);
                    setShowLobby(false);
                }

                return;
            }

            if (response.roomNotFound) {
                window.location.href = "/?error=Room not found";
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error fetching room data:", error);
            return null;
        }
    };

    const joinRoom = async (id, nickname) => {
        try {
            sessionStorage.setItem("nickname", nickname);
            const response = await api.joinRoom(id, nickname);
            console.log(response);

            if (response.roomNotFound) {
                window.location.href = "/?error=Room not found";
                setIsLoading(false);
                return;
            }

            if (response.gameStarted) {
                setGameInProgressCannotJoin(true);
                setIsLoading(false);
                setShowJoinForm(false);
                setShowLobby(false);
                return;
            }

            // if (response.success) {
            //     setNickname(nickname);
            //     setIsLoading(false);
            //     setGameInProgressCannotJoin(false);
            // }
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const startGame = async () => {
        // check if there are more than one player in the room
        if (room.players.length < 2) {
            setStartGameError("Must have at least 2 players to start the game.");
        } else {
            await api.startGame(id);
            setShowJoinForm(false);
            setShowLobby(false);
        }
    };

    useEffect(() => {
        if (!id) {
            window.location.href = "/";
            return;
        }

        // get nickname from session storage
        const storedNickname = sessionStorage.getItem("nickname");
        if (storedNickname) {
            setNickname(storedNickname);
        }

        if (id && !storedNickname) {
            getRoomData(id);
        }

        if (id && storedNickname) {
            joinRoom(id, storedNickname);
        }

        const socket = api.getSocket();
        socket.on("room data", (roomData) => {
            if (roomData) {
                setRoom(roomData);
                setIsLoading(false);

                if (!roomData.gameStarted) {
                    setShowLobby(true);
                } else {
                    setShowLobby(false);
                }

                setGameInProgressCannotJoin(false);
                setShowJoinForm(false);

                console.log({ roomData, storedNickname });
            }
        });
    }, []);

    const StartGameButton = () => {
        return (
            room &&
            !room.gameStarted &&
            nickname === room.admin.name && (
                <div className="mt-8 flex flex-col gap-2">
                    <Button onClickFunc={startGame} styleType="primary">
                        Start Game
                    </Button>
                    {startGameError && <p className="bg-red-50 text-red-700 p-2 border border-red-400 rounded-lg mt-2 text-sm font-bold">{startGameError}</p>}
                </div>
            )
        );
    };

    const PlayersList = () => {
        return (
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Players in the room:</h2>
                <ul className="list-disc pl-5">
                    {room &&
                        room.players.map((player) => {
                            const isAdmin = player.name === room.admin.name;
                            const isCurrentPlayer = player.name === nickname;
                            return (
                                <li key={player.name} className="text-lg">
                                    {player.name} {isAdmin ? "(Admin)" : ""} {isCurrentPlayer ? "(You)" : ""}
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
                    <a href="/" className="underline text-cyan-800 text-center mt-4 hover:no-underline block">
                        Back to home
                    </a>
                </div>
            </main>
        );
    };

    const JoinForm = () => {
        const [nickname, setNickname] = useState("");
        const [error, setError] = useState("");

        const handleJoinRoom = () => {
            const playersInRoom = room ? room.players : [];
            // if nickname is the same as a player.name, show error
            if (playersInRoom.some((player) => player.name === nickname)) {
                setError("Nickname already taken. Please choose a different nickname.");
                return;
            }

            if (!nickname) {
                setError("Please enter a valid nickname");
                return;
            }

            setError("");
            joinRoom(id, nickname);
        };

        return (
            <div className="h-screen grid place-items-center">
                <main className="max-w-80 w-full mx-auto p-4 mb-4">
                    <h1 className="flex justify-center">
                        <img src={WcagLogo.src} alt="The WCAG Card Game" width="300" />
                    </h1>
                    <form className="mt-10 mb-8 flex flex-col items-stretch gap-4">
                        {error && <p className="text-red-600 bg-red-100 border border-red-300 px-2 py-1 rounded-md font-bold text-sm">{error}</p>}
                        <TextInput value={nickname} label="Enter your nickname" changeFunction={setNickname} name="nickname" />
                        <div className="flex flex-col gap-6 mt-4">
                            <Button onClickFunc={() => handleJoinRoom()} styleType="primary">
                                Join room
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
                    <h1 className="flex justify-center">
                        <img src={WcagLogo.src} alt="The WCAG Card Game" width="250" />
                    </h1>
                    <PlayersList />
                    {room && room.admin.name === nickname && <StartGameButton />}
                    <div className="mt-4">
                        <Button styleType="secondary" onClickFunc={() => copyLink()}>
                            <InsertLinkIcon />
                            <span className="ml-2">Invite</span>
                        </Button>
                        {copied && <p className="bg-amber-200 text-amber-700 p-2 border border-amber-400 rounded-full mt-2 text-sm font-bold text-center">Room link copied to clipboard!</p>}
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
                    {showJoinForm && <JoinForm />}
                    {showLobby && <Lobby />}

                    {room && room.gameStarted && !gameInProgressCannotJoin && <Game room={room} playerName={nickname} />}
                    {gameInProgressCannotJoin && <CannotJoinRoom />}
                </>
            )}
        </div>
    );
};

export default Page;

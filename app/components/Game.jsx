import api from "@/lib/api";
import CardBack from "@/assets/card-back.png";
import DrawPileImg from "@/assets/draw-pile.png";
import PlayerHand from "@/components/PlayerHand";
import CardImage from "./CardImage";
import UserCard from "@/components/UserCard";
import CardModal from "@/components/CardModal";

const Game = ({ room, playerName }) => {
	console.log(room);
	console.log(playerName);

	const drawCard = () => {
		api.drawCard(room.id, playerName);
	};

	const resetGame = () => {
		api.resetGame(room.id);
	};

	const GameStatus = ({ message, colour = "orange" }) => {
		const colours = {
			orange: " from-orange-500/0 via-orange-500 to-orange-500/0",
			green: "from-green-500/0 via-green-500 to-green-500/0",
			yellow: "from-yellow-500/0 via-yellow-500 to-yellow-500/0"
		};

		return (
			<div className={`game-status bg-gradient-to-r ${colours[colour]}`}>
				<p className="font-poetsen text-lg text-center py-1">{message}</p>
			</div>
		);
	};

	const PlayerName = ({ name, points, size = "regular" }) => {
		const sizeClasses = {
			small: {
				gap: "gap-1",
				text: "text-xs",
				points: "h-2 w-2 mt-1"
			},
			regular: {
				gap: "gap-2",
				text: "text-xl",
				points: "h-3 w-3 mt-1"
			}
		};

		return (
			<div className={`player-name flex ${sizeClasses[size].gap} items-center`}>
				<p className={`font-poetsen ${sizeClasses[size].text}`}>{name}</p>
				{Array.from({ length: points }).map((_, index) => {
					return (
						<div
							key={index}
							className={`bg-green-400 rounded-full ${sizeClasses[size].points}`}
						></div>
					);
				})}
			</div>
		);
	};

	const Opponent = ({ name }) => {
		const player = room.players.find((p) => p.name === name);
		const cards = player ? player.hand : [];

		return (
			player && (
				<div className="flex flex-col items-center gap-2">
					<PlayerName name={name} points={player.points} size="small" />
					<PlayerHand cards={cards} size="small" />
					<div className="h-8 flex gap-2 justify-center">
						<CardImage imgSrc={CardBack.src} height="h-full" />
						<CardImage imgSrc={CardBack.src} height="h-full" />
					</div>
				</div>
			)
		);
	};

	const Player = () => {
		const player = room.players.find((p) => p.name === playerName);
		const cards = player ? player.hand : [];

		return (
			<div className="you flex flex-col items-center gap-2">
				<div className="h-16 flex gap-2">
					<CardImage imgSrc={CardBack.src} height="h-full" />
					<CardImage imgSrc={CardBack.src} height="h-full" />
				</div>
				<div className="w-[300px]">
					<PlayerHand cards={cards} />
				</div>
				<PlayerName name={playerName} />
			</div>
		);
	};

	const DrawPile = () => {
		return (
			<div className="relative">
				<button
					className="group absolute top-0 left-0 grid place-items-center"
					onClick={() => drawCard()}
				>
					<div className="group-hover:translate-y-2 transition-all">
						<CardImage imgSrc={CardBack.src} />
					</div>
					<p className="absolute text-nowrap bg-[#0ef375] px-4 py-2 rounded-full font-poetsen shadow-md">
						Draw card
					</p>
				</button>

				<CardImage imgSrc={DrawPileImg.src} height="h-[112px]" />
			</div>
		);
	};

	return (
		<>
			<main className="landscape-screen portrait:hidden max-w-5xl w-full mx-auto p-4"></main>
			<main className="portrait-screen landscape:hidden max-w-5xl w-full mx-auto p-4">
				<div className="flex flex-col gap-4 mt-4">
					<div className="flex gap-4 justify-center mb-8">
						<DrawPile />
						<UserCard card={room.game.userCard} />
					</div>
					<div className="opponents">
						<ul className="flex justify-center flex-wrap gap-4 w-full">
							{room.players.map((player, index) => {
								if (player.name !== playerName) {
									return (
										<li key={index} className="w-[100px] ">
											<Opponent name={player.name} />
										</li>
									);
								}
							})}
						</ul>
					</div>
					<GameStatus message="Shandawg is choosing a player" colour="yellow" />
					<Player />
				</div>
			</main>
		</>
	);
};

export default Game;

import Button from "@/components/Button";
import api from "@/lib/api";
import CardBack from "@/assets/card-back.png";

const Game = ({ room, playerName }) => {
	console.log(room);
	console.log(playerName);

	const drawCard = () => {
		api.drawCard(room.id, playerName);
	};

	const resetGame = () => {
		api.resetGame(room.id);
	};

	const A11yCard = ({ card, hide = false }) => {
		return !hide ? (
			<div className="border border-slate-300 p-4 rounded-lg shadow w-32 h-40">
				<strong>{card.title}</strong>
			</div>
		) : (
			<div className="border border-slate-300 p-4 rounded-lg shadow w-32 h-40 bg-slate-300"></div>
		);
	};

	const UserCard = ({ card }) => {
		return (
			<div className="flex justify-center items-center mb-8">
				<div className="border border-blue-400 p-4 rounded-lg shadow w-40 h-48">
					<strong>{card.name}</strong>
					<p className="text-sm mt-2">{card.description}</p>
				</div>
			</div>
		);
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

	const CardDisplay = ({ imgSrc, height = "100px" }) => {
		return (
			<div className={`user-cards w-auto h-[${height}] rounded-lg`}>
				<img src={imgSrc} className="object-cover w-full h-full" />
			</div>
		);
	};

	const HandDisplay = ({ playerName }) => {
		const player = room.players.find((p) => p.name === playerName);
		const cards = player ? player.hand : [];

		return (
			<ul className="flex justify-center w-full overflow-hidden">
				{cards.map((_, index) => {
					const totalCards = cards.length;

					// Calculate overlap based on total cards
					const calculateOverlap = (totalCards) => {
						if (totalCards <= 3) return "ml-2";
						if (totalCards <= 5) return "ml-1";
						if (totalCards <= 7) return "-ml-4";
						if (totalCards <= 10) return "-ml-6";
						return "-ml-8"; // For more than 10 cards
					};

					const overlapAmount = calculateOverlap(totalCards);

					return (
						<li
							key={index}
							className={`${
								index > 0 ? overlapAmount : ""
							} transition-all duration-200 hover:translate-y-[-8px] hover:z-10`}
							style={{ zIndex: index }}
						>
							<CardDisplay imgSrc={CardBack.src} height="100%" />
						</li>
					);
				})}
			</ul>
		);
	};

	const HandDisplaySmall = ({ playerName }) => {
		const player = room.players.find((p) => p.name === playerName);
		const cards = player ? player.hand : [];

		return (
			<ul className="flex justify-center w-full overflow-hidden">
				{cards.map((_, index) => {
					const totalCards = cards.length;

					// Calculate overlap based on total cards
					const calculateOverlap = (totalCards) => {
						if (totalCards <= 3) return "ml-1";
						if (totalCards <= 7) return "-ml-4";
						if (totalCards <= 10) return "-ml-6";
						return "-ml-8"; // For more than 10 cards
					};

					const overlapAmount = calculateOverlap(totalCards);

					return (
						<li
							key={index}
							className={`${
								index > 0 ? overlapAmount : ""
							} transition-all duration-200 hover:translate-y-[-8px] hover:z-10`}
							style={{ zIndex: index }}
						>
							<CardDisplay imgSrc={CardBack.src} height="16px" />
						</li>
					);
				})}
			</ul>
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

		return (
			player && (
				<div className="flex flex-col items-center gap-2">
					<PlayerName name={name} points={player.points} size="small" />
					<HandDisplaySmall playerName={name} />
					<div className="h-8 flex gap-2 justify-center">
						<CardDisplay imgSrc={CardBack.src} height="100%" />
						<CardDisplay imgSrc={CardBack.src} height="100%" />
					</div>
				</div>
			)
		);
	};

	return (
		<>
			<main className="landscape-screen portrait:hidden max-w-5xl w-full mx-auto p-4"></main>
			<main className="portrait-screen landscape:hidden max-w-5xl w-full mx-auto p-4">
				<div className="flex flex-col gap-4 mt-4">
					<div className="flex gap-4 justify-center mb-8">
						<CardDisplay imgSrc={CardBack.src} />
						<CardDisplay imgSrc={CardBack.src} />
					</div>
					<div className="players">
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
					<div className="you flex flex-col items-center gap-2">
						<div className="h-16 flex gap-2">
							<CardDisplay imgSrc={CardBack.src} height="100%" />
							<CardDisplay imgSrc={CardBack.src} height="100%" />
						</div>
						<div className="w-[300px]">
							<HandDisplay playerName={playerName} />
						</div>
						<PlayerName name={playerName} />
					</div>
				</div>
			</main>
		</>
	);
};

export default Game;

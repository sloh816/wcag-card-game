import PersonIcon from "@/assets/person-icon.png";
import CardModal from "@/components/CardModal";
import { useState } from "react";

const UserCard = ({ card, a11yCards }) => {
	const [showCard, setShowCard] = useState(false);

	// if you click outside the cardmodal, close it
	if (showCard) {
		window.addEventListener("click", (e) => {
			if (e.target.closest(".card-modal")) {
				setShowCard(false);
			}
		});
	}

	const Card = ({ size = "large" }) => {
		const sizes = {
			large: {
				cardSize: "w-[300px] h-[420px] rounded-lg",
				innerCardSize: "w-[275px] h-[395px] rounded-lg",
				titleSize: "text-2xl px-2 py-1",
				imageSize: "w-[260px] h-[175px] border-2",
				descriptionSize: "text-xs h-[62px] -mb-6 -mt-6 rounded-md w-[245px] shadow-sm p-2",
				listSize:
					"text-sm w-[285px] -ml-[5px] pt-6 p-2 rounded-md min-h-[160px] shadow-md ",
				listItemsSize: "list-disc text-xs ml-6 gap-8 leading-relaxed mt-1"
			},
			small: {
				cardSize: "w-[80px] h-[112px] rounded-sm",
				innerCardSize: "w-[75px] h-[105px] rounded-sm",
				titleSize: "text-xs px-1 py-0.5",
				imageSize: "w-[70px] h-[45px] border",
				descriptionSize:
					"text-[3px] h-[20px] -mb-6 -mt-6 rounded-sm w-[65px] shadow-sm p-1",
				listSize:
					"w-[75px] p-[4px] rounded-sm h-[40px] shadow-md text-[4px] pt-[10px] leading-tight",
				listItemsSize: "text-[3px] ml-[4px] mt-[2px]"
			}
		};

		return (
			<div
				className={`${sizes[size].cardSize} grid place-items-center relative bg-[#0070b9] text-left`}
			>
				<div
					className={`${sizes[size].innerCardSize} flex flex-col justify-between items-start bg-[#6fb3d6]`}
				>
					<div className="flex flex-col w-full">
						<h1
							className={`font-poetsen leading-none text-black text-left ${sizes[size].titleSize}`}
						>
							{card.name}
						</h1>
						<div
							className={`${sizes[size].imageSize} self-center overflow-hidden shrink-1 border-white`}
						>
							<img src={PersonIcon.src} className="h-full w-full object-cover" />
						</div>
					</div>
					<p className={`bg-[#c3e3ef] self-center z-30 ${sizes[size].descriptionSize}`}>
						{card.description + "."}
					</p>
					<div
						className={`text-black leading-1 bg-white text-left ${sizes[size].listSize}`}
					>
						<p className="font-poetsen">Accessibility practices:</p>
						<ul className={`columns-2 ${sizes[size].listItemsSize}`}>
							{card.a11yNumbers.map((number) => {
								const a11yCard = a11yCards.find((a) => a.number === number);
								return <li key={number}>{a11yCard ? a11yCard.title : number}</li>;
							})}
						</ul>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div>
			<button onClick={() => setShowCard(true)}>
				<Card size="small" />
			</button>
			{showCard && (
				<CardModal>
					<Card />
				</CardModal>
			)}
		</div>
	);
};

export default UserCard;

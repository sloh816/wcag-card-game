"use client";
import { useState } from "react";
import CardImage from "@/components/CardImage";
import CardBack from "@/assets/card-back.png";
import CardModal from "@/components/CardModal";
import Card from "@/components/Card";

const PlayerHand = ({ cards, size = "regular" }) => {
	const [showCard, setShowCard] = useState(false);

	// if you click outside the cardmodal, close it
	if (showCard) {
		window.addEventListener("click", (e) => {
			if (e.target.closest(".card-modal")) {
				setShowCard(false);
			}
		});
	}

	const calculateShift = (totalCards) => {
		if (totalCards <= 3) return "";
		if (totalCards <= 7) return "ml-2";
		if (totalCards <= 10) return "ml-3";
		return "ml-4"; // For more than 10 cards
	};

	return (
		<>
			<ul className={`flex justify-center w-full ${calculateShift(cards.length)}`}>
				{cards.map((card, index) => {
					const totalCards = cards.length;

					// Calculate overlap based on total cards
					const calculateOverlap = (totalCards) => {
						if (totalCards <= 3) return "ml-2";
						if (totalCards <= 5) return "ml-1";
						if (totalCards <= 7) return "-ml-4";
						if (totalCards <= 10) return "-ml-6";
						return "-ml-8"; // For more than 10 cards
					};

					const calculateOverlapSmall = (totalCards) => {
						if (totalCards <= 3) return "ml-1";
						if (totalCards <= 4) return "-ml-3";
						if (totalCards <= 5) return "-ml-[16px]";
						if (totalCards <= 6) return "-ml-[20px]";
						if (totalCards <= 8) return "-ml-6";
						return "-ml-[37px]"; // For more than 10 cards
					};

					const overlapAmount =
						size === "small"
							? calculateOverlapSmall(totalCards)
							: calculateOverlap(totalCards);

					const cardHeight = size === "small" ? "h-[44px]" : "h-full";

					return size === "small" ? (
						<li
							key={index}
							className={`${index > 0 ? overlapAmount : ""}`}
							style={{ zIndex: index }}
						>
							<CardImage imgSrc={CardBack.src} height={cardHeight} />
						</li>
					) : (
						<li key={index}>
							<button
								className={`${overlapAmount} transition-all duration-200 hover:translate-y-[-8px] hover:z-10 block`}
								style={{ zIndex: index }}
								onClick={() => setShowCard(card)}
							>
								<Card card={card} size="small" />
							</button>
						</li>
					);
				})}
			</ul>
			{showCard && (
				<CardModal>
					<Card card={showCard} />
				</CardModal>
			)}
		</>
	);
};

export default PlayerHand;

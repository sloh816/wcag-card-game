import Swirls from "@/assets/swirls.png";
import OrangeSpikes from "@/assets/spikes-orange.png";
import PurpleSpikes from "@/assets/spikes-purple.png";

const Card = ({ card, size = "large" }) => {
	const orangeCards = ["Change user", "Block", "Inaccessible", "Steal"];
	const purpleCards = ["Wild card"];

	let colour = "yellow";
	if (orangeCards.includes(card.title)) {
		colour = "orange";
	} else if (purpleCards.includes(card.title)) {
		colour = "purple";
	}

	const colours = {
		yellow: {
			dark: "bg-yellow-400",
			light: "bg-[#ece9af]",
			pattern: Swirls.src
		},
		orange: {
			dark: "bg-orange-400",
			light: "bg-[#ebd5af]",
			pattern: OrangeSpikes.src
		},
		purple: {
			dark: "bg-[#322a58]",
			light: "bg-[#afa8be]",
			pattern: PurpleSpikes.src
		}
	};

	const sizes = {
		large: {
			cardSize: "w-[300px] h-[420px] rounded-lg",
			innerCardSize: "w-[275px] h-[395px] rounded-lg",
			titleSize: "text-2xl px-2 py-1",
			imageSize: "w-[275px]",
			descriptionSize: "text-sm w-[285px] -ml-[5px] p-2 rounded-md min-h-[84px] shadow-md",
			wcagScPadding: "py-1 px-2",
			wcagScSize: "text-xs"
		},
		small: {
			cardSize: "w-[56px] h-[78px] rounded-sm",
			innerCardSize: "w-[52px] h-[74px] rounded-sm",
			titleSize: "text-[6px] px-[2px] py-[1px]",
			imageSize: "w-[52px]",
			descriptionSize:
				"text-[2px] w-[54px] -ml-[1px] p-[1px] rounded-sm min-h-[16px] shadow-sm",
			wcagScPadding: "p-[1px]",
			wcagScSize: "text-[1px]"
		},
		reallySmall: {
			cardSize: "w-[32px] h-[44px]",
			innerCardSize: "w-[30px] h-[44px]",
			titleSize: "text-[3px] px-[2px] py-[1px]",
			imageSize: "w-[30px]",
			descriptionSize: "text-[1px] w-[31px] -ml-[1px] p-[1px] min-h-[10px] shadow-sm",
			wcagScPadding: "p-[1px]",
			wcagScSize: "text-[1px]"
		}
	};

	return (
		<div
			className={`${sizes[size].cardSize} grid place-items-center relative ${colours[colour].dark}`}
		>
			<div
				className={`${sizes[size].innerCardSize} flex flex-col justify-between items-start ${colours[colour].light}`}
			>
				<h1
					className={`font-poetsen leading-none text-black text-left ${sizes[size].titleSize}`}
				>
					{card.title}
				</h1>
				<div className={`${sizes[size].imageSize} overflow-hidden shrink-1`}>
					<img src={colours[colour].pattern} className="h-full w-full object-cover" />
				</div>
				<p
					className={`text-black leading-1 bg-white text-left ${sizes[size].descriptionSize}`}
				>
					{card.description}.
				</p>
				{card.wcagSc && (
					<div className={`text-left ${sizes[size].wcagScPadding}`}>
						<p className={`${sizes[size].wcagScSize}`}>WCAG Success Criterion</p>
						<p className={`${sizes[size].wcagScSize} font-bold`}>{card.wcagSc}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Card;

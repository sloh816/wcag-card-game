import Card from "@/components/Card";

const CardModal = ({ card }) => {
	return (
		<div className="card-modal fixed top-0 bottom-0 left-0 right-0 grid place-items-center z-50">
			<div className="bg-black/10 fixed top-0 bottom-0 left-0 right-0"></div>
			<Card card={card} colour="yellow" />
		</div>
	);
};

export default CardModal;

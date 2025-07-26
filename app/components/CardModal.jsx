const CardModal = ({ children }) => {
	return (
		<div className="card-modal fixed top-0 bottom-0 left-0 right-0 grid place-items-center z-50">
			<div className="bg-black/50 fixed top-0 bottom-0 left-0 right-0"></div>
			{children}
		</div>
	);
};

export default CardModal;

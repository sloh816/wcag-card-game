const CardImage = ({ imgSrc, height = "h-[100px]", card }) => {
	return (
		<div className={`user-cards w-auto ${height} rounded-lg`}>
			<img src={imgSrc} className="object-cover w-full h-full" />
		</div>
	);
};

export default CardImage;

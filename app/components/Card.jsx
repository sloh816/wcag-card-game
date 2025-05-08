const Card = ({ title, link, icon }) => {
	return (
		<div className="grid place-items-center py-8 px-4 border border-navy-20 shadow-md rounded-lg w-64 hover:border-grapefruit-100 relative transition-all">
			<div className="flex flex-col items-center gap-4">
				{icon && <img src={icon} alt="" className="h-24" />}
				<p className="heading-3 text-center">
					<a
						className="after:content-normal after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0"
						href={link}
					>
						{title}
					</a>
				</p>
			</div>
		</div>
	);
};

export default Card;

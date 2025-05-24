import iagIcon from "@/assets/iag-icon.png";

const Card = ({ title, link, icon, description }) => {
	const iconSrc = icon || iagIcon.src;
	const wrapperClasses = link
		? "hover:border-grapefruit-100 relative transition-all"
		: "cursor-not-allowed opacity-50 grayscale";

	return (
		<div
			className={`py-4 px-6 pb-6 border border-navy-20 shadow-md rounded-lg w-80 h-full ${wrapperClasses}`}
		>
			<div className="flex items-start gap-4">
				{iconSrc && <img src={iconSrc} alt="" className="w-10" />}
				<div className="flex flex-col gap-2">
					<p className="heading-3">
						<a
							className="after:content-normal after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0"
							href={link}
						>
							{title}
						</a>
					</p>
					{description && <p className="text-charcoal-100 text-sm">{description}</p>}
				</div>
			</div>
		</div>
	);
};

export default Card;

import WcagLogo from "@/assets/wcag-card-game-logo.png";

const Logo = ({ heading1 = true, width = 300 }) => {
	return (
		<>
			{heading1 ? (
				<h1 className="flex justify-center">
					<img src={WcagLogo.src} alt="The WCAG Card Game" width={width} />
				</h1>
			) : (
				<div className="flex justify-center">
					<img src={WcagLogo.src} alt="The WCAG Card Game" width={width} />
				</div>
			)}
		</>
	);
};

export default Logo;

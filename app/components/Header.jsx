import iagIcon from "@/assets/iag-icon.png";

const Header = ({ title, links, h1 }) => {
	return (
		<header className="px-4 h-20 shadow-md flex items-center justify-between fixed top-0 left-0 right-0 bg-white z-10">
			<div className="left flex items-center gap-4">
				<img src={iagIcon.src} alt="IAG Icon" className="w-12" />
				{h1 ? (
					<h1 className="font-bold text-2xl text-navy-100">{title}</h1>
				) : (
					<p className="font-bold text-2xl text-navy-100">{title}</p>
				)}
			</div>

			<a href="/" className="mr-4 hover:underline underline-offset-4">
				Tools & Databases
			</a>
			{links && (
				<nav>
					<ul className="flex gap-4">
						{Object.entries(links).map(([name, link]) => (
							<li key={name}>
								<a
									href={link}
									className="font-bold px-4 py-2 text-navy-100 no-underline decoration-grapefruit-100 decoration-2 underline-offset-4 hover:underline"
								>
									{name}
								</a>
							</li>
						))}
					</ul>
				</nav>
			)}
		</header>
	);
};

export default Header;

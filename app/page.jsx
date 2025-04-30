"use client";
import icon from "@/assets/iag-icon.png";
import Card from "@/components/Card";

const HomePage = ({}) => {
	const tools = [
		{
			title: "Easy Read style guide",
			link: "/style-guide"
		},
		{
			title: "User testing feedback",
			link: "/user-testing"
		}
	];
	return (
		<>
			<header className="mt-20 flex flex-col items-center gap-6">
				<img src={icon.src} alt="IAG Logo" className="w-16" />
				<h1 className="heading-1">Tools & Databases</h1>
			</header>
			<main className="mt-20">
				<ul className="flex gap-4 justify-center">
					{tools.map((tool) => {
						return (
							<li key={tool.title}>
								<Card title={tool.title} link={tool.link} icon={icon.src} />
							</li>
						);
					})}
				</ul>
			</main>
		</>
	);
};

export default HomePage;

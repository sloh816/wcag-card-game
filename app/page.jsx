"use client";
import icon from "@/assets/iag-icon.png";
import Card from "@/components/Card";

const HomePage = ({}) => {
	const databases = [
		{
			title: "Easy Read style guide",
			link: "/style-guide"
		},
		{
			title: "User testing feedback",
			link: "/user-testing"
		}
	];

	const tools = [
		{
			title: "InDesign to Word (HTML converter)",
			link: "/indesign-to-word"
		}
	];

	return (
		<>
			<header className="container p-8 flex gap-4 items-center mt-8">
				<img src={icon.src} alt="IAG Icon" className="w-12" />
				<h1 className="font-bold text-navy-100 text-3xl">Tools & Databases</h1>
			</header>
			<main className="mt-4 container">
				<h2 className="heading-2 mb-2">Databases</h2>
				<ul className="flex gap-4">
					{databases.map((tool) => {
						return (
							<li key={tool.title}>
								<Card title={tool.title} link={tool.link} icon={icon.src} />
							</li>
						);
					})}
				</ul>

				<h2 className="heading-2 mb-2 mt-16">Tools</h2>
				<ul className="flex gap-4">
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

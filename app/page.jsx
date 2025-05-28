"use client";
import Card from "@/components/Card";
import icon from "@/assets/iag-icon.png";

const HomePage = ({}) => {
	const databases = [
		{
			title: "Easy Read Style Guide",
			link: "/style-guide",
			description: "A writing style guide for IAG Easy Read content."
		},
		{
			title: "User Testing Feedback",
			link: "/user-testing",
			description: "User testing feedback collection from our focus group testing."
		},
		{
			title: "Easy Read Database",
			description: "Search for images and text from all our past Easy Read content."
		}
	];

	const tools = [
		{
			title: "InDesign to Word (HTML Converter)",
			link: "/indesign-to-word",
			description: "Process an InDesign HTML file to copy into a Word document."
		},
		{
			title: "PDF Strip tables",
			description: "Strip the <Table> tags from the PDF tags. Useful for doing Easy Read FA."
		},
		{
			title: "Alt Text Generator",
			description:
				"Write alt text for images in a Word document. Alt text suggestions are generated for images used in past Easy Read documents."
		},
		{
			title: "Easy Read HTML Builder",
			description: "Generate an Easy Read HTML from a Word or InDesign document."
		},
		{
			title: "Word to HTML",
			description: "Generate a HTML from a Word document."
		},
		{
			title: "Web Audit Report Generator",
			description:
				"Record the issues of your website audit and generate a Word and HTML report."
		}
	];

	return (
		<>
			<header className="px-12 flex gap-4 flex-col items-center mt-20 mb-12 container">
				<img src={icon.src} alt="IAG Icon" className="w-16" />
				<h1 className="font-bold text-navy-100 text-3xl">Tools & Databases</h1>
			</header>
			<main className="px-12 container mb-20">
				<h2 className="heading-2 mb-2">Databases</h2>
				<ul className="flex gap-4">
					{databases.map((tool) => {
						return (
							<li key={tool.title}>
								<Card
									title={tool.title}
									link={tool.link}
									description={tool.description}
									icon={tool.icon}
									disabled={tool.disabled ? tool.disabled : false}
								/>
							</li>
						);
					})}
				</ul>

				<h2 className="heading-2 mb-2 mt-12">Tools</h2>
				<ul className="flex gap-4 flex-wrap">
					{tools.map((tool) => {
						return (
							<li key={tool.title}>
								<Card
									title={tool.title}
									link={tool.link}
									description={tool.description}
									icon={tool.icon}
									disabled={tool.disabled ? tool.disabled : false}
								/>
							</li>
						);
					})}
				</ul>
			</main>
		</>
	);
};

export default HomePage;

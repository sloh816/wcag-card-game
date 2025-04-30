"use client";
import "@/styles.scss";
import { useEffect, useState } from "react";
import { styleGuide } from "@/lib/directus";
import Header from "@/components/Header";
import HandymanIcon from "@mui/icons-material/Handyman";

export default function RootLayout({ children }) {
	const [links, setLinks] = useState({});

	useEffect(() => {
		const fetch = async () => {
			const directories = await styleGuide.getDirectories();
			const links = {};
			directories.forEach((directory) => {
				return (links[directory.title] = `/style-guide/${directory.slug}`);
			});
			setLinks(links);
		};
		fetch();
	}, []);

	return (
		<>
			<body className="body">
				<a
					href="/"
					className="flex gap-2 items-center text-sm fixed bottom-4 left-4 px-4 py-2 bg-white shadow-md rounded-full border border-cotton-100"
				>
					<HandymanIcon className="w-6" />
					<span>Internal tools</span>
				</a>
				<Header title="Easy Read Style guide" links={links} />
				<main className="my-40">{children}</main>
			</body>
		</>
	);
}

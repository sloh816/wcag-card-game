"use client";
import "@/styles.scss";
import Header from "@/components/Header";
import InternalToolsLink from "@/components/InternalToolsLink";

export default function RootLayout({ children }) {
	const links = {};

	return (
		<>
			<body className="body">
				<InternalToolsLink />
				<Header title="User testing feedback" links={links} />
				<main className="my-40">{children}</main>
			</body>
		</>
	);
}

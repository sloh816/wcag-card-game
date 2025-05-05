"use client";
import "@/styles.scss";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
	return (
		<>
			<body className="body">
				<Header title="Easy Read style guide" />
				<main>{children}</main>
			</body>
		</>
	);
}

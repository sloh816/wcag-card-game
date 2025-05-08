import "@/styles.scss";

export const metadata = {
	title: "Tools & Databases",
	description: "Links to tools and databases for The Information Access Group."
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" title={metadata.title}>
			<body className="body">{children}</body>
		</html>
	);
}

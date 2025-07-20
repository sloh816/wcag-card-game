import "@/styles.scss";

export const metadata = {
	title: "My App",
	description: "A description of my app"
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" title={metadata.title}>
			<body className="body">{children}</body>
		</html>
	);
}

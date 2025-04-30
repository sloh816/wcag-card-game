import "@/styles.scss";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="body">{children}</body>
		</html>
	);
}

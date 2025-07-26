import "@/styles.scss";
import ServerConnection from "./components/ServerConnection";

export const metadata = {
	title: "My App",
	description: "A description of my app"
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" title={metadata.title}>
			<body className="body image-bg">
				<ServerConnection />
				{children}
			</body>
		</html>
	);
}

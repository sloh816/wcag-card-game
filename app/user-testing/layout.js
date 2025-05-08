import "@/styles.scss";
import Header from "@/components/Header";

export const metadata = {
	title: "User testing feedback",
	description: "A database of user testing feedback for The Information Access Group."
};

export default function RootLayout({ children }) {
	return (
		<>
			<body className="body">
				<Header title="User testing feedback" />
				<main>{children}</main>
			</body>
		</>
	);
}

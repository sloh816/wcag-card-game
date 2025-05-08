import "@/styles.scss";
import Header from "@/components/Header";

export const metadata = {
	title: "Easy Read style guide",
	description: "A style guide for writing Easy Reads for the Information Access Group."
};

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

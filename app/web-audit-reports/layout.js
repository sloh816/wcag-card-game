import "@/styles.scss";
import Header from "@/components/Header";

export const metadata = {
	title: "Web Audit Report Builder",
	description: "Web Audit Report Builder for The Information Access Group."
};

export default function RootLayout({ children }) {
	return (
		<>
			<body className="body">
				<Header title="Web Audit Report Builder" />
				<main className="mt-20">{children}</main>
			</body>
		</>
	);
}

"use client";
import "@/styles.scss";
import Header from "@/components/Header";
import HandymanIcon from "@mui/icons-material/Handyman";

export default function RootLayout({ children }) {
	return (
		<>
			<body className="body">
				<a
					href="/"
					className="flex gap-2 items-center text-sm fixed top-4 right-4 px-4 py-2 bg-white shadow-md rounded-full border border-cotton-100 z-20"
				>
					<HandymanIcon className="w-6" />
					<span>Internal tools</span>
				</a>
				<Header title="Easy Read style guide" />
				<main>{children}</main>
			</body>
		</>
	);
}

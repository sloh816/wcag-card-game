import HandymanIcon from "@mui/icons-material/Handyman";

const InternalToolsLink = ({}) => {
	return (
		<a
			href="/"
			className="flex gap-2 items-center text-sm fixed bottom-4 left-4 px-4 py-2 bg-white shadow-md rounded-full border border-cotton-100"
		>
			<HandymanIcon className="w-6" />
			<span>Internal tools</span>
		</a>
	);
};

export default InternalToolsLink;

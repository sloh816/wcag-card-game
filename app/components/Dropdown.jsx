import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Dropdown = ({ title, children }) => {
	return (
		<details className="bg-white rounded-lg border border-navy-20 hover:border-grapefruit-100 shadow-md">
			<summary className="font-bold text-navy-100 text-lg cursor-pointer flex justify-between bg-white py-4 px-6 rounded-lg">
				{title}
				<KeyboardArrowDownIcon />
			</summary>
			<div className="item-content m-6 mt-0">{children}</div>
		</details>
	);
};

export default Dropdown;

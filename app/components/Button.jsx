const Button = ({ label, onClickFunc, styleType = "primary" }) => {
	const buttonStyles = {
		primary: "bg-cyan-600 text-white hover:bg-cyan-700",
		secondary: "bg-cyan-200 text-cyan-900 border-cyan-400 border hover:bg-cyan-300"
	};

	return (
		<button
			type="button"
			className={`block w-full px-4 py-3 rounded-lg font-bold transition-colors ${buttonStyles[styleType]}`}
			onClick={onClickFunc}
		>
			{label}
		</button>
	);
};

export default Button;

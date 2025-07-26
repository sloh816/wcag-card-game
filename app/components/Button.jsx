const Button = ({ children, onClickFunc, styleType = "primary", disabled = false }) => {
	const buttonStyles = {
		primary: "bg-gradient-to-r from-green-500 to-green-500",
		secondary: "bg-gradient-to-r to-yellow-400 from-amber-500"
	};

	const disabledStyles = "bg-gray-400 cursor-not-allowed opacity-60";
	const enabledStyles = buttonStyles[styleType];

	return (
		<button
			type="button"
			className={`font-poetsen text-lg block w-full px-4 py-2 rounded-full shadow-md transition-colors ${
				disabled ? disabledStyles : enabledStyles
			}`}
			onClick={disabled ? undefined : onClickFunc}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;

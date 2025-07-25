const Button = ({ label, onClickFunc, styleType = "primary" }) => {
    const buttonStyles = {
        primary: "bg-gradient-to-r from-green-500 to-green-500",
        secondary: "bg-gradient-to-r to-yellow-400 from-amber-500",
    };

    return (
        <button type="button" className={`font-poetsen text-lg block w-full px-4 py-2 rounded-full shadow-md font-bold transition-colors ${buttonStyles[styleType]}`} onClick={onClickFunc}>
            {label}
        </button>
    );
};

export default Button;

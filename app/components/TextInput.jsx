"use client";
import { useState } from "react";

const TextInput = ({ label, name, value, changeFunction, errorMsg }) => {
	const [error, setError] = useState(errorMsg || "");

	const handleChange = (e) => {
		// validate that the input is a string
		if (typeof e.target.value !== "string") {
			setError("Input must be a string");
			return;
		}

		changeFunction(e.target.value);
	};

	return (
		<>
			<label className="flex flex-col gap-2">
				<strong>{label}</strong>
				<input
					type="text"
					value={value}
					onChange={handleChange}
					className="border border-gray-300 rounded p-2"
					name={name}
				/>
			</label>
			{error && <p className="text-red-500">{error}</p>}
		</>
	);
};

export default TextInput;

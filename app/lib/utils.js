export function generateUUID() {
	return "xxxx-xxxx-xxxx-yxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function formatDate(date, currentFormat = "yyyy-mm-dd") {
	// make sure it's in yyyy-mm-dd or dd-mm-yyyy format
	if (typeof date === "string") {
		const parts = date.split("-");

		let date = {
			year: parseInt(parts[0], 10),
			month: parseInt(parts[1], 10),
			day: parseInt(parts[2], 10)
		};

		if (currentFormat === "dd-mm-yyyy") {
			date = {
				year: parseInt(parts[2], 10),
				month: parseInt(parts[1], 10),
				day: parseInt(parts[0], 10)
			};
		}

		const months = {
			1: "January",
			2: "February",
			3: "March",
			4: "April",
			5: "May",
			6: "June",
			7: "July",
			8: "August",
			9: "September",
			10: "October",
			11: "November",
			12: "December"
		};

		const monthName = months[date.month];
		return `${date.day} ${monthName}, ${date.year}`;
	} else {
		throw new Error("Invalid date format");
	}
}

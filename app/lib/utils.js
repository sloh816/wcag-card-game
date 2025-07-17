export function generateUUID() {
	return "xxxx-xxxx-xxxx-yxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function formatDateTime(dateTime) {
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
	const date = new Date(dateTime);
	const dateString = date.toLocaleDateString();
	const timeString = date.toLocaleTimeString();
	const [day, m, year] = dateString.split("/");
	const month = months[parseInt(m)];
	console.log(m);
	const AMPM = timeString.split(" ")[1];
	const [hour, minute, second] = timeString.split(" ")[0].split(":");

	const formattedDate = `${day} ${month}, ${year} ${hour}:${minute} ${AMPM}`;
	return formattedDate;
}

export function formatDate(date) {
	// make sure it's in yyyy-mm-dd format
	if (typeof date === "string") {
		const parts = date.split("-");
		if (parts.length === 3) {
			date = {
				year: parseInt(parts[0], 10),
				month: parseInt(parts[1], 10),
				day: parseInt(parts[2], 10)
			};

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
}

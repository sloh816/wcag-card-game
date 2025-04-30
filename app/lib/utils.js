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

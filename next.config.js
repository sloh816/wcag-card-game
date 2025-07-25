module.exports = {
	async redirects() {
		return [
			{
				source: "/room",
				destination: "/",
				permanent: true
			}
		];
	}
};

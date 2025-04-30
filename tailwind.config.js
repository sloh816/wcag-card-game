/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			colors: {
				navy: {
					100: "#001c69",
					80: "#334987",
					60: "#6677a5",
					40: "#99a4c3",
					20: "#ccd2e1"
				},
				grapefruit: {
					100: "#ed4c48",
					80: "#f1706d",
					60: "#f49491",
					40: "#f8b7b6",
					20: "#fbdbda"
				},
				honey: {
					100: "#eda321",
					80: "#f1706d",
					60: "#f4c87a",
					40: "#f8daa6",
					20: "#fbedd3"
				},
				teal: {
					100: "#008296",
					80: "#339bab",
					60: "#66b4c0",
					40: "#99cdd5",
					20: "#cce6ea"
				},
				cotton: {
					100: "#edebe5",
					50: "#f6f5f2"
				},
				charcoal: {
					200: "#1f1f1f",
					100: "#525252"
				}
			}
		}
	},
	plugins: []
};

import axios from "axios";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
if (!serverUrl) {
	throw new Error("❌ SERVER_URL is not defined");
}

const api = {
	prependStyles: async (formData) => {
		const response = await axios.post(`${serverUrl}/prepend-styles`, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});

		return response;
	},

	wordToHtml: async (formData) => {
		const response = await axios.post(`${serverUrl}/word-to-html`, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});
		console.log(response);
		return response;
	},

	checkConnection: async () => {
		try {
			const response = await axios.get(`${serverUrl}/check-connection`);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getServerFiles: async () => {
		try {
			const response = await axios.get(`${serverUrl}/files`);
			return response.data;
		} catch (error) {
			console.error("Error fetching server files:", error);
			throw error;
		}
	},

	deleteServerFiles: async (folders) => {
		try {
			const response = await axios.delete(`${serverUrl}/delete-lib-files`, {
				data: folders,
				headers: {
					"Content-Type": "application/json"
				}
			});
			return response;
		} catch (error) {
			console.error("Error deleting server files:", error);
			throw error;
		}
	}
};

export default api;

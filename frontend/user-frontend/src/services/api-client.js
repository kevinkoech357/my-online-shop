const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = async (url, options = {}) => {
	const defaultHeaders = {
		"Content-Type": "application/json",
	};

	const response = await fetch(`${BASE_URL}${url}`, {
		...options,
		credentials: "include",
		headers: {
			...defaultHeaders,
			...options.headers,
		},
	});

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage || "Something went wrong");
	}

	return response.json(); // the response is in JSON format
};

export default apiClient;

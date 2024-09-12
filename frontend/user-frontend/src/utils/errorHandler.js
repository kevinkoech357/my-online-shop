// Handle errors
export const handleError = (error) => {
	if (error.response) {
		// Server responded with a status other than 2xx
		console.error("Server error:", error.response.data);
		throw new Error(error.response.data.message || "Server error occurred.");
	} else if (error.request) {
		// No response was received from the server
		console.error("Network error:", error.message);
		throw new Error("Network error. Please check your connection.");
	} else {
		// Something else went wrong during request setup
		console.error("Error:", error.message);
		throw new Error("An unexpected error occurred.");
	}
};

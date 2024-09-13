import { handleError } from "../utils/errorHandler";
import apiClient from "./api-client";

// Function to subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
	try {
		const response = await apiClient("/newsletter/subscribe", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		return response;
	} catch (error) {
		handleError(error);
	}
};

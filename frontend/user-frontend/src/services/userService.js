import { handleError } from "../utils/errorHandler";
import apiClient from "./api-client";

// Function to subscribe to newsletter

export const subscribeToNewsletter = async (email) => {
	try {
		const response = await apiClient.post("/newsletter/subscribe", { email });
		return response.data;
	} catch (error) {
		handleError(error);
	}
};

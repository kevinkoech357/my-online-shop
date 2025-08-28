import { handleError } from "../utils/errorHandler";
import apiClient from "./api-client";

// Function to get all Products from the db with optional query parameters
export const getAllProducts = async (params = {}, signal) => {
	try {
		// Create query string from params
		const queryString = new URLSearchParams(params).toString();
		// Use apiClient.get for GET requests
		const response = await apiClient.get(
			`/products${queryString ? "?" + queryString : ""}`,
			{ signal },
		);
		return response;
	} catch (error) {
		if (error.name !== "AbortError") {
			handleError(error);
		}
		throw error;
	}
};

// Function to view a single Product by ID
export const viewOneProduct = async (productID, signal) => {
	try {
		// Use apiClient.get for GET requests
		const response = await apiClient.get(`/products/${productID}`, { signal });
		return response;
	} catch (error) {
		if (error.name !== "AbortError") {
			handleError(error);
		}
		throw error;
	}
};

import { handleError } from "../utils/errorHandler";
import apiClient from "./api-client";

// Function to get all Products from the db with optional query parameters
export const getAllProducts = async (params = {}) => {
	try {
		const queryString = new URLSearchParams(params).toString();
		const response = await apiClient(`/products?${queryString}`, {
			method: "GET",
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

// Function to view a single Product by ID
export const viewOneProduct = async (productID) => {
	try {
		const response = await apiClient(`/products/${productID}`, {
			method: "GET",
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

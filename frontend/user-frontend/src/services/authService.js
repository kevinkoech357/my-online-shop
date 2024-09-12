import { handleError } from "../utils/errorHandler";
import apiClient from "./api-client";

// Function to register a user
export const registerUserService = async (userData) => {
	try {
		const response = await apiClient.post("/auth/register", userData);
		return response.data;
	} catch (error) {
		handleError(error);
	}
};

// Verify OTP
export const verifyOTPService = async (userData) => {
	try {
		const response = await apiClient.post("/auth/verify", userData);
		return response.data;
	} catch (error) {
		handleError(error);
	}
};

// Resend OTP
export const resendOTPService = async (email) => {
	try {
		const response = await apiClient.post("/auth/resend", email);
		return response.data;
	} catch (error) {
		handleError(error);
	}
};

// Login user
export const loginUserService = async (userCredentials) => {
	try {
		const response = await apiClient.post("/auth/login", userCredentials);
		return response.data;
	} catch (error) {
		handleError(error);
	}
};

// Logout user
export const logoutUserService = async () => {
	try {
		const response = await apiClient.post("/auth/logout", {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		handleError(error);
	}
};

// Check user login status
export const checkUserLoginStatus = async () => {
	try {
		const response = await apiClient.get("/user", { withCredentials: true });
		return response.data;
	} catch (error) {
		handleError(error);
	}
};

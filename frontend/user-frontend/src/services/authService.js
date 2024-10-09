import { handleError } from "../utils/errorHandler";
import apiClient from "./api-client";

// Function to register a user
export const registerUserService = async (userData) => {
	try {
		const response = await apiClient("/auth/register", {
			method: "POST",
			body: JSON.stringify(userData),
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

// Verify OTP
export const verifyOTPService = async (userData) => {
	try {
		const response = await apiClient("/auth/verify", {
			method: "POST",
			body: JSON.stringify(userData),
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

// Resend OTP
export const resendOTPService = async (email) => {
	try {
		const response = await apiClient("/auth/resend", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

// Login user
export const loginUserService = async (userCredentials) => {
	try {
		const response = await apiClient("/auth/login", {
			method: "POST",
			body: JSON.stringify(userCredentials),
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

// Logout user
export const logoutUserService = async () => {
	try {
		const response = await apiClient("/auth/logout", {
			method: "POST",
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

// Check user login status
export const checkUserLoginStatus = async () => {
	try {
		const response = await apiClient("/user", {
			method: "GET",
		});
		return response;
	} catch (error) {
		handleError(error);
	}
};

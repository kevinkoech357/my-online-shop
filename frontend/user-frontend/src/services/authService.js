import { handleError } from "../utils/errorHandler";
import apiClient from "./api-client";

const AUTH_ENDPOINTS = {
	REGISTER: "/auth/register",
	VERIFY: "/auth/verify",
	RESEND: "/auth/resend",
	LOGIN: "/auth/login",
	LOGOUT: "/auth/logout",
	CHECK_STATUS: "/auth/status",
};

class AuthService {
	static DEFAULT_RETRY_OPTIONS = { retries: 1 };

	/**
	 * Generic method to handle API requests with error handling and retries.
	 * @param {Function} requestFn - The API request function to execute.
	 * @param {string} methodName - The name of the method for logging purposes.
	 * @returns {Promise<any>} - The response from the API.
	 */
	static async makeRequest(requestFn, methodName = "unknown") {
		try {
			return await requestFn();
		} catch (error) {
			console.error(`Error in ${methodName}:`, error);
			handleError(error); // Handle the error globally
			throw error; // Re-throw the error for further handling if needed
		}
	}

	/**
	 * Registers a new user.
	 * @param {Object} userData - The user's registration data.
	 * @returns {Promise<any>} - The response from the API.
	 */
	static async registerUser(userData) {
		return this.makeRequest(
			() =>
				apiClient.post(
					AUTH_ENDPOINTS.REGISTER,
					userData,
					this.DEFAULT_RETRY_OPTIONS,
				),
			"registerUser",
		);
	}

	/**
	 * Verifies an OTP for a user.
	 * @param {Object} userData - The user's OTP verification data.
	 * @returns {Promise<any>} - The response from the API.
	 */
	static async verifyOTP(userData) {
		return this.makeRequest(
			() =>
				apiClient.post(
					AUTH_ENDPOINTS.VERIFY,
					userData,
					this.DEFAULT_RETRY_OPTIONS,
				),
			"verifyOTP",
		);
	}

	/**
	 * Resends an OTP to the user's email.
	 * @param {string} email - The user's email address.
	 * @returns {Promise<any>} - The response from the API.
	 */
	static async resendOTP(email) {
		return this.makeRequest(
			() =>
				apiClient.post(
					AUTH_ENDPOINTS.RESEND,
					{ email },
					this.DEFAULT_RETRY_OPTIONS,
				),
			"resendOTP",
		);
	}

	/**
	 * Logs in a user.
	 * @param {Object} userCredentials - The user's login credentials.
	 * @returns {Promise<any>} - The response from the API.
	 */
	static async loginUser(userCredentials) {
		return this.makeRequest(
			() =>
				apiClient.post(
					AUTH_ENDPOINTS.LOGIN,
					userCredentials,
					this.DEFAULT_RETRY_OPTIONS,
				),
			"loginUser",
		);
	}

	/**
	 * Logs out a user.
	 * @returns {Promise<any>} - The response from the API.
	 */
	static async logoutUser() {
		return this.makeRequest(
			() => apiClient.post(AUTH_ENDPOINTS.LOGOUT, this.DEFAULT_RETRY_OPTIONS),
			"logoutUser",
		);
	}

	/**
	 * Checks the user's login status.
	 * @returns {Promise<any>} - The response from the API.
	 */
	static async checkLoginStatus() {
		return this.makeRequest(
			() =>
				apiClient.get(AUTH_ENDPOINTS.CHECK_STATUS, this.DEFAULT_RETRY_OPTIONS),
			"checkLoginStatus",
		);
	}
}

// Export individual service methods for backward compatibility
export const registerUserService = AuthService.registerUser;
export const verifyOTPService = AuthService.verifyOTP;
export const resendOTPService = AuthService.resendOTP;
export const loginUserService = AuthService.loginUser;
export const logoutUserService = AuthService.logoutUser;
export const checkUserLoginStatus = AuthService.checkLoginStatus;

export default AuthService;

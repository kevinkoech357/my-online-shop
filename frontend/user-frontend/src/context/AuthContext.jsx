import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	checkUserLoginStatus,
	loginUserService,
	logoutUserService,
} from "../services/authService";
import { useCustomToast } from "../utils/toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const showToast = useCustomToast();

	useEffect(() => {
		const checkStatus = async () => {
			try {
				await checkUserLoginStatus();
				setIsLoggedIn(true);
				//navigate("/");
			} catch (error) {
				console.error(error);
				setIsLoggedIn(false);
				navigate("/auth/login");
			} finally {
				setIsLoading(false);
			}
		};

		checkStatus();
	}, [navigate]);

	const login = async (userCredentials) => {
		try {
			const response = await loginUserService(userCredentials);
			showToast(
				"Login Successful",
				response.message || "Welcome back!",
				"success",
			);
			setIsLoggedIn(true);
		} catch (error) {
			console.error(error);
			showToast(
				"Login Failed",
				error.message || "Please try again later.",
				"error",
			);
			throw new Error("Login failed");
		}
	};

	const logout = async () => {
		try {
			const response = await logoutUserService();
			showToast("Logout Successful", response.message, "success");
			setIsLoggedIn(false);
			navigate("/auth/login");
		} catch (error) {
			console.error(error);

			showToast("Logout Failed", error.message, "error");
		}
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

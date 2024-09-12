import { useToast } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	checkUserLoginStatus,
	loginUserService,
	logoutUserService,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const toast = useToast();

	useEffect(() => {
		const checkStatus = async () => {
			try {
				await checkUserLoginStatus();
				setIsLoggedIn(true);
				navigate("/");
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
			toast({
				title: "Login Successful",
				description: response.message || "Welcome back!",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top-right",
			});
			setIsLoggedIn(true);
		} catch (error) {
			console.error(error);
			toast({
				title: "Login Failed",
				description: error.message || "Please try again later.",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-right",
			});
			throw new Error("Login failed");
		}
	};

	const logout = async () => {
		try {
			const response = await logoutUserService();
			toast({
				title: "Logout Successful",
				description: response.message,
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
			setIsLoggedIn(false);
			navigate("/auth/login");
		} catch (error) {
			console.error(error);

			toast({
				title: "Logout Failed",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
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

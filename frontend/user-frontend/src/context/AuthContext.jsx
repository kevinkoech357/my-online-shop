import { Flex, Spinner } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import { useCustomToast } from "../utils/toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [redirectPath, setRedirectPath] = useState("/");
	const navigate = useNavigate();
	const location = useLocation();
	const showToast = useCustomToast();

	const login = async (credentials) => {
		setIsLoading(true);
		try {
			const response = await AuthService.loginUser(credentials, "login");
			setUser(response.details);
			showToast(
				"Login Successful",
				response.message || "Welcome back!",
				"success",
			);

			// Navigate to saved path or home
			navigate(redirectPath || "/");
			setIsLoggedIn(true);
			setRedirectPath("/"); // Reset redirect path
		} catch (error) {
			console.error("Login error:", error);
			setIsLoggedIn(false);
			showToast(
				"Login Failed",
				error.message || "Please try again later.",
				"error",
			);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await AuthService.logoutUser("logout");
			setUser(null);
			setIsLoggedIn(false);
			showToast("Logout Successful", "You have been logged out.", "success");
			navigate("/auth/login");
		} catch (error) {
			console.error("Logout error:", error);
			showToast(
				"Logout Failed",
				error.message || "Unable to logout. Please try again.",
				"error",
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const checkLoginStatus = async () => {
			try {
				const response = await AuthService.checkLoginStatus("checkStatus");
				setUser(response.details);
				setIsLoggedIn(true); // Update logged in status
			} catch (error) {
				console.error("Login status check failed:", error);
				setUser(null);
				setIsLoggedIn(false); // Ensure logged in status is set to false on error

				// Define allowed routes that do not require login
				const allowedAuthRoutes = [
					"/auth/login",
					"/auth/register",
					"/auth/forgot-password",
				];
				const isAllowedRoute = allowedAuthRoutes.some((route) =>
					location.pathname.startsWith(route),
				);

				// Only redirect if the current path is not in the allowed routes
				if (!isAllowedRoute) {
					const currentPath = location.pathname + location.search;
					setRedirectPath(currentPath);
					navigate("/auth/login", { replace: true });
				}
			} finally {
				setIsLoading(false);
			}
		};

		checkLoginStatus();
	}, [location.pathname, location.search, navigate]);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				login,
				logout,
				isLoggedIn,
			}}
		>
			{!isLoading ? (
				children
			) : (
				<Flex justifyContent="center" alignItems="center" height="100vh">
					<Spinner size="xl" />
				</Flex>
			)}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default useAuth;

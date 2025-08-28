import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/AuthContext";

const ProtectedRoute = ({ redirectPath = "/auth/login", children }) => {
	const { isLoggedIn, isLoading } = useAuth();

	// Show a loading spinner while checking authentication
	if (isLoading) {
		return (
			<Flex height="100vh" align="center" justify="center" direction="column">
				<Spinner size="xl" color="blue.500" />
				<Text mt={4} fontSize="lg" color="gray.600">
					Checking authentication...
				</Text>
			</Flex>
		);
	}

	// Redirect if not authenticated
	if (!isLoggedIn) {
		return <Navigate to={redirectPath} replace />;
	}

	// Render children or nested routes
	return children || <Outlet />;
};

export default ProtectedRoute;

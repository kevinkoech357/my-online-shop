import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
	return (
		<Box className="auth-layout">
			<Outlet />
		</Box>
	);
}

export default AuthLayout;

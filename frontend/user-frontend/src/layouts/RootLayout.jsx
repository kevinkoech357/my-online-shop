import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import { AuthProvider } from "../context/AuthContext";

const RootLayout = () => {
	return (
		<AuthProvider>
			<Box display="flex" flexDirection="column" minHeight="100vh">
				<Box as="header">
					<Navbar />
				</Box>
				<Box as="main" flex="1" p={{ base: 2, md: 4 }}>
					<Outlet />
				</Box>
				<Box as="footer">
					<Footer />
				</Box>
			</Box>
		</AuthProvider>
	);
};

export default RootLayout;

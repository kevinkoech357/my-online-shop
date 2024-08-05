import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const RootLayout = () => {
	return (
		<Box display="flex" flexDirection="column" minHeight="100vh">
			<Navbar />
			<Box as="main" flex="1" p={4}>
				<Outlet />
			</Box>
			<Footer />
		</Box>
	);
};

export default RootLayout;

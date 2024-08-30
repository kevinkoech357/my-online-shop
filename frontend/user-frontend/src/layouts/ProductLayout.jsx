import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

function ProductLayout() {
	return (
		<Box className="product-layout">
			<Outlet />
		</Box>
	);
}

export default ProductLayout;

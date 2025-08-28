import { useEffect, useState } from "react";
import ProductGridWithSidebar from "../../components/products/ProductGridWithSidebar";
import { getAllProducts } from "../../services/productService";
import ErrorPage from "../general/ErrorPage";

const ProductPage = () => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	// Fetch all products when the component mounts if the user is logged in
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const result = await getAllProducts();
				console.log(result);
				setData(result);
			} catch (error) {
				console.error(error);
				setError(error);
			}
		};

		fetchProducts(); // Call the function to fetch products
	}, []); // Empty dependency array to ensure it runs only on mount

	if (error) {
		return <ErrorPage />;
	}

	if (!data) {
		return <p>Loading...</p>;
	}

	return <ProductGridWithSidebar data={data} />;
};

export default ProductPage;

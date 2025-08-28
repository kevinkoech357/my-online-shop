import { Box, Button, Grid, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getAllProducts } from "../../services/productService";
import AdvancedSearchSidebar from "./AdvancedSearchSidebar";
import ProductCard from "./ProductCard";

const ITEMS_PER_PAGE = 20;

const ProductGridWithSidebar = ({ initialData }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const _location = useLocation();
	const navigate = useNavigate();
	const [products, setProducts] = useState(initialData?.products || []);
	const [totalProducts, setTotalProducts] = useState(initialData?.total || 0);
	const [currentPage, _setCurrentPage] = useState(
		parseInt(searchParams.get("page")) || 1,
	);
	const [filters, setFilters] = useState({});

	useEffect(() => {
		const queryFilters = {};
		for (const [key, value] of searchParams.entries()) {
			if (key !== "page") {
				queryFilters[key] = value;
			}
		}
		setFilters(queryFilters);
		fetchProducts(queryFilters, parseInt(searchParams.get("page")) || 1);
	}, [searchParams]);

	const fetchProducts = useCallback(async (filters, page) => {
		try {
			const queryParams = {
				...filters,
				page: page,
				limit: ITEMS_PER_PAGE,
			};

			const response = await getAllProducts(queryParams);

			if (response.success) {
				setProducts(response.products);
				setTotalProducts(response.total);
			} else {
				console.error("Failed to fetch products:", response.message);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	}, []);

	const handleFilterChange = useCallback(
		(newFilters) => {
			const queryParams = new URLSearchParams({
				...newFilters,
				page: 1,
			}).toString();
			setSearchParams(queryParams);
			navigate(`/products?${queryParams}`, { replace: true });
		},
		[navigate, setSearchParams],
	);

	const handlePageChange = useCallback(
		(newPage) => {
			const queryParams = new URLSearchParams({
				...filters,
				page: newPage,
			}).toString();
			setSearchParams(queryParams);
			navigate(`/products?${queryParams}`, { replace: true });
		},
		[filters, navigate, setSearchParams],
	);

	const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

	return (
		<Grid templateColumns={{ base: "1fr", lg: "1fr 3fr" }} gap={6}>
			<Box>
				<AdvancedSearchSidebar
					onFilterChange={handleFilterChange}
					initialFilters={filters}
				/>
			</Box>
			<Box>
				{products.length === 0 ? (
					<Box textAlign="center" p={4}>
						No products found
					</Box>
				) : (
					<>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
							{products.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</SimpleGrid>
						<HStack justifyContent="center" mt={8}>
							<Button
								onClick={() => handlePageChange(currentPage - 1)}
								isDisabled={currentPage === 1}
							>
								Previous
							</Button>
							<Text>
								Page {currentPage} of {totalPages}
							</Text>
							<Button
								onClick={() => handlePageChange(currentPage + 1)}
								isDisabled={currentPage === totalPages}
							>
								Next
							</Button>
						</HStack>
					</>
				)}
			</Box>
		</Grid>
	);
};

export default ProductGridWithSidebar;

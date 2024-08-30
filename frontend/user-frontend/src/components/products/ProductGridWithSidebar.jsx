import { Box, Flex, Grid, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import AdvancedSearchSidebar from "./AdvancedSearchSidebar";
import ProductCard from "./ProductCard";

const ProductGridWithSidebar = ({ products }) => {
	const [filteredProducts, setFilteredProducts] = useState(products);

	const handleFilterChange = (filter) => {
		if (!filter) {
			// Reset filters if no filter is provided
			setFilteredProducts(products);
			return;
		}

		switch (filter.type) {
			case "category":
				if (filter.value.length > 0) {
					setFilteredProducts(
						products.filter((product) =>
							filter.value.includes(product.category),
						),
					);
				} else {
					setFilteredProducts(products); // Reset if no categories selected
				}
				break;

			case "price":
				setFilteredProducts(
					products.filter(
						(product) =>
							product.price >= filter.value[0] &&
							product.price <= filter.value[1],
					),
				);
				break;

			default:
				setFilteredProducts(products); // Default to all products
				break;
		}
	};

	return (
		<Grid templateColumns={{ base: "1fr", lg: "1fr 3fr" }} gap={6}>
			{/* Sidebar */}
			<Box>
				<AdvancedSearchSidebar onFilterChange={handleFilterChange} />
			</Box>

			{/* Product Grid */}
			<Box>
				<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
					{filteredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</SimpleGrid>
			</Box>
		</Grid>
	);
};

export default ProductGridWithSidebar;

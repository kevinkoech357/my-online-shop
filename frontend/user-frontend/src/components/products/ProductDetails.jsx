import {
	Badge,
	Box,
	Button,
	HStack,
	Heading,
	Image,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Stack,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";

import Rating from "./ProductRating";

import productsData from "../../data/products.json";
import ErrorPage from "../../pages/general/ErrorPage";

const products = productsData;

const ProductDetails = () => {
	const { slug } = useParams(); // Fetching the slug from the URL
	const product = products.find((p) => p.slug === slug); // Find the product based on the slug
	const [quantity, setQuantity] = useState(1); // State for handling product quantity

	// Define the color values here
	const textColor = useColorModeValue("gray.700", "gray.300");
	const _priceColor = useColorModeValue("gray.800", "white");

	if (!product) {
		return <ErrorPage />;
	}

	return (
		<Box
			maxW="7xl"
			mx="auto"
			px={{ base: "4", md: "8" }}
			py={{ base: "6", md: "12" }}
		>
			<Stack direction={{ base: "column", md: "row" }} spacing="8">
				{/* Product Image */}
				<Box flex="1">
					<Image
						src={product.image}
						alt={product.name}
						rounded="lg"
						w="full"
						h={{ base: "100%", md: "500px" }}
						objectFit="cover"
					/>
				</Box>

				{/* Product Details */}
				<Box flex="1">
					<VStack align="start" spacing="4">
						<Badge colorScheme="green" fontSize="1em" rounded="full">
							{product.category}
						</Badge>
						<Heading as="h2" size="xl" fontWeight="bold">
							{product.name}
						</Heading>
						<Text fontSize="lg" color={textColor}>
							{product.brand}
						</Text>
						<Rating rating={product.rating} numReviews={product.numReviews} />
						<Text fontSize="xl" fontWeight="bold">
							£{product.price.toFixed(2)}
						</Text>
						<Text color={textColor}>{product.description}</Text>

						{/* Quantity Selector */}
						<HStack spacing="4" mt="6">
							<NumberInput
								min={1}
								value={quantity}
								onChange={(value) => setQuantity(parseInt(value))}
								maxW="100px"
								clampValueOnBlur={false}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>

							<Button
								colorScheme="blue"
								size="lg"
								leftIcon={<FiShoppingCart />}
								onClick={() =>
									console.log("Add to cart:", product.id, quantity)
								}
							>
								Add {quantity} to Cart
							</Button>
						</HStack>
					</VStack>
				</Box>
			</Stack>
		</Box>
	);
};

export default ProductDetails;

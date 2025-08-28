import {
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Image,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Spinner,
	Stack,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import ErrorPage from "../../pages/general/ErrorPage";
import cartService from "../../services/cartService";
import { getAllProducts } from "../../services/productService";
import { useCustomToast } from "../../utils/toastify";
import Rating from "./ProductRating";

const ProductDetails = () => {
	const { slug } = useParams();
	const [quantity, setQuantity] = useState(1);
	const [product, setProduct] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const showToast = useCustomToast();
	const textColor = useColorModeValue("gray.700", "gray.300");

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const result = await getAllProducts();
				const foundProduct = result.products.find((p) => p.slug === slug);
				if (foundProduct) {
					setProduct(foundProduct);
				} else {
					setError(new Error("Product not found"));
				}
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [slug]);

	const addToCart = async () => {
		if (!product) return;

		// Just use the first color from the product's color array
		const productColor = product.color[0];

		setIsAddingToCart(true);
		try {
			const response = await cartService.addOrUpdateProduct(
				product._id,
				quantity,
				productColor, // Using the first available color
			);
			showToast("Cart updated successfully", response.message, "success");
		} catch (error) {
			showToast(
				"Error updating cart",
				error.message || "An error occurred while updating cart",
				"error",
			);
		} finally {
			setIsAddingToCart(false);
		}
	};

	if (loading) {
		return (
			<Flex justifyContent="center" alignItems="center" height="60vh">
				<Spinner size="xl" />
			</Flex>
		);
	}

	if (error || !product) {
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
						src={product.images[0]?.url || "/blue-icon.png"}
						alt={product.name}
						rounded="lg"
						w="full"
						h={{ base: "100%", md: "500px" }}
						objectFit="cover"
						onError={(e) => {
							e.target.src = "/blue-icon.png"; // Fallback image
						}}
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
								onChange={(valueString) => {
									const parsedValue = parseInt(valueString, 10);
									if (!isNaN(parsedValue) && parsedValue > 0) {
										setQuantity(parsedValue);
									}
								}}
								maxW="100px"
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
								onClick={addToCart}
								isLoading={isAddingToCart}
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

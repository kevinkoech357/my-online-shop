import {
	Alert,
	AlertIcon,
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	IconButton,
	Image,
	Spinner,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../../services/cartService";
import { useCustomToast } from "../../utils/toastify";
import CartItem from "./CartItem";

const Cart = () => {
	const [cart, setCart] = useState(() => cartService.cart);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const itemBgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const navigate = useNavigate();
	const showToast = useCustomToast();

	// Helper function for API calls
	const handleApiCall = async (
		apiFunction,
		successMessage,
		errorMessage,
		signal,
	) => {
		setLoading(true);
		setError(null);
		try {
			const result = await apiFunction(signal);
			setCart(result); // Update cart state with the latest data
			showToast("Success", successMessage, "success");
			return result;
		} catch (err) {
			setError(err.message || errorMessage);
			showToast("Error", err.message || errorMessage, "error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// Fetch the current cart
	const fetchCart = async (signal) => {
		return handleApiCall(
			() => cartService.getCurrentCart(signal),
			"Cart loaded successfully",
			"Failed to load cart",
			signal,
		);
	};

	// Add or update a product in the cart
	const addProductToCart = async (productId, newQuantity, color, signal) => {
		return handleApiCall(
			() =>
				cartService.addOrUpdateProduct(productId, newQuantity, color, signal),
			`Added ${newQuantity} item(s) to the cart`,
			"Failed to add product to cart",
			signal,
		);
	};

	// Remove a product from the cart
	const removeProductFromCart = async (productId, signal) => {
		return handleApiCall(
			() => cartService.removeProduct(productId, signal),
			"Product removed from cart",
			"Failed to remove product from cart",
			signal,
		);
	};

	// Clear the entire cart
	const clearCart = async (signal) => {
		return handleApiCall(
			() => cartService.clearCart(signal),
			"Cart has been cleared",
			"Failed to clear cart",
			signal,
		).then((result) => {
			setCart({ ...result, items: [] }); // Reset cart items to an empty array
		});
	};

	// Fetch the cart on component mount
	useEffect(() => {
		const controller = new AbortController();
		fetchCart(controller.signal);
		return () => {
			controller.abort();
		};
	}, []);

	// Handle quantity change
	const handleQuantityChange = (productId, newQuantity, color) => {
		addProductToCart(productId, newQuantity, color);
	};

	// Handle removing an item
	const handleRemoveItem = (productId) => {
		removeProductFromCart(productId);
	};

	// Handle clicking on a product
	const handleProductClick = (slug) => {
		navigate(`/products/${slug}`); // Navigate to the product details page using `slug`
	};

	// Loading state
	if (loading) {
		return (
			<Flex justifyContent="center" alignItems="center" height="60vh">
				<Spinner size="xl" />
			</Flex>
		);
	}

	// Empty cart state
	if (cart.items.length === 0) {
		return (
			<Flex
				justifyContent="center"
				alignItems="center"
				height="60vh"
				width="100%"
				p={6}
			>
				<VStack spacing={4} p={8}>
					<Text fontSize="2xl" color="gray.600" fontWeight="bold">
						Your Cart is Empty
					</Text>
					<Button
						as={Link}
						to="/products"
						variant="solid"
						colorScheme="blue"
						size="lg"
					>
						Continue Shopping
					</Button>
				</VStack>
			</Flex>
		);
	}

	return (
		<Box bg={bgColor} minH="100vh" py={12}>
			{/* Error message */}
			{error && (
				<Alert status="error" mb={4}>
					<AlertIcon />
					{error}
				</Alert>
			)}
			<Box maxWidth="1200px" margin="0 auto" px={4}>
				<Heading as="h3" mb={8} textAlign="center">
					My Shopping Cart
				</Heading>
				<Flex direction={{ base: "column", lg: "row" }} gap={8}>
					{/* Cart Items */}
					<VStack spacing={6} align="stretch" flex={3}>
						{cart.items.map((item) => (
							<CartItem
								key={`${item.product}`}
								item={item}
								onQuantityChange={handleQuantityChange}
								onRemove={handleRemoveItem}
								onProductClick={handleProductClick}
							/>
						))}
					</VStack>
					{/* Order Summary */}
					<Box
						flex={1}
						p={6}
						borderRadius="lg"
						borderWidth="1px"
						borderColor={borderColor}
						bg={itemBgColor}
						shadow="md"
						height="fit-content"
					>
						<Heading as="h2" size="lg" mb={6}>
							Order Summary
						</Heading>
						<VStack spacing={4} align="stretch">
							<Flex justify="space-between">
								<Text>Subtotal</Text>
								<Text>KES {cart.cartTotal}</Text>
							</Flex>
							<Flex justify="space-between">
								<Text>Total Items</Text>
								<Text>{cart.totalItems}</Text>
							</Flex>
							<Button colorScheme="blue" as={Link} to="/checkout">
								Proceed to Checkout
							</Button>
							<Button
								colorScheme="red"
								onClick={() => clearCart()}
								isLoading={loading}
							>
								Clear Cart
							</Button>
							<Button
								colorScheme="blue"
								variant="outline"
								as={Link}
								to="/products"
							>
								Continue shopping
							</Button>
						</VStack>
					</Box>
				</Flex>
			</Box>
		</Box>
	);
};

export default Cart;

import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Badge,
	Box,
	Flex,
	HStack,
	Heading,
	IconButton,
	Image,
	Text,
	Tooltip,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

const CartItem = ({ item, onQuantityChange, onRemove, onProductClick }) => {
	const { product, quantity, price, color, name, slug, image } = item;
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState(null);

	// Fallback values for incomplete product data
	const productName = name || "Unknown Product";
	const productImage = image || "/blue-icon.png"; // Fallback image
	const productSlug = slug || "#"; // Fallback slug
	const productPrice = price || price; // Use `price` from `item` if `product.price` is missing

	// Decrease quantity
	const handleQuantityDecrease = async () => {
		if (quantity <= 1) return; // Prevent decreasing below 1
		setIsUpdating(true);
		setError(null); // Reset error state
		try {
			const newQuantity = Math.max(1, quantity - 1); // Ensure quantity doesn't go below 1
			await onQuantityChange(product, newQuantity, color); // Pass productId and new quantity
		} catch (error) {
			console.error("Error updating quantity:", error.message);
			setError(error.response?.data?.message || "Failed to update quantity.");
		} finally {
			setIsUpdating(false);
		}
	};

	// Increase quantity
	const handleQuantityIncrease = async () => {
		setIsUpdating(true);
		setError(null); // Reset error state
		try {
			const newQuantity = quantity + 1; // Increment the quantity
			await onQuantityChange(product, newQuantity, color); // Pass productId and new quantity
		} catch (error) {
			console.error("Error updating quantity:", error.message);
			setError(error.response?.data?.message || "Failed to update quantity.");
		} finally {
			setIsUpdating(false);
		}
	};

	// Remove item
	const handleRemove = async () => {
		setIsUpdating(true);
		setError(null); // Reset error state
		try {
			await onRemove(product); // Pass productId
		} catch (error) {
			console.error("Error removing item:", error.message);
			setError(error.response?.data?.message || "Failed to remove item.");
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Box
			p={4}
			borderWidth="1px"
			borderRadius="lg"
			borderColor={borderColor}
			bg={bgColor}
			shadow="md"
			transition="all 0.3s"
			_hover={{ shadow: "lg" }}
		>
			{/* Display error message if any */}
			{error && (
				<Alert status="error" mb={4}>
					<AlertIcon />
					{error}
				</Alert>
			)}
			<Flex>
				{/* Product Image */}
				<Image
					src={productImage} // Use fallback image if `product.image` is missing
					alt={productName} // Use fallback name if `product.name` is missing
					boxSize="100px"
					objectFit="cover"
					mr={4}
					borderRadius="md"
					cursor="pointer"
					onClick={() => onProductClick(productSlug)} // Redirect using `product.slug`
					onError={(e) => {
						e.target.src = "/blue-icon.png"; // Fallback image
					}}
				/>
				{/* Product Details */}
				<VStack align="start" flex={1} spacing={2}>
					<Heading
						size="md"
						cursor="pointer"
						onClick={() => onProductClick(productSlug)} // Redirect using `product.slug`
					>
						{productName} {/* Use fallback name if `product.name` is missing */}
					</Heading>
					{color && (
						<Text fontSize="sm" color="gray.500">
							<Badge colorScheme="blue"> Color: {color}</Badge>
						</Text>
					)}
					<Text fontWeight="bold">KES {productPrice}</Text>{" "}
					{/* Use fallback price */}
				</VStack>
				{/* Quantity Controls and Remove Button */}
				<VStack align="end" spacing={2}>
					<HStack>
						{/* Decrease Quantity Button */}
						<Tooltip label="Decrease quantity">
							<IconButton
								icon={<MinusIcon />}
								size="sm"
								onClick={handleQuantityDecrease}
								aria-label="Decrease quantity"
								colorScheme="red"
								variant="outline"
								isDisabled={quantity <= 1 || isUpdating}
								isLoading={isUpdating}
							/>
						</Tooltip>
						{/* Display Current Quantity */}
						<Text fontWeight="bold" minW="40px" textAlign="center">
							{quantity}
						</Text>
						{/* Increase Quantity Button */}
						<Tooltip label="Increase quantity">
							<IconButton
								icon={<AddIcon />}
								size="sm"
								onClick={handleQuantityIncrease}
								aria-label="Increase quantity"
								colorScheme="green"
								variant="outline"
								isLoading={isUpdating}
							/>
						</Tooltip>
					</HStack>
					{/* Remove Item Button */}
					<Tooltip label="Remove item">
						<IconButton
							icon={<DeleteIcon />}
							size="sm"
							onClick={handleRemove}
							aria-label="Remove item"
							colorScheme="red"
							variant="ghost"
							isLoading={isUpdating}
						/>
					</Tooltip>
				</VStack>
			</Flex>
		</Box>
	);
};

export default CartItem;

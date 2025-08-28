// Validate the cart structure and contents
export const validateCart = (cart) => {
	if (!cart || !Array.isArray(cart.items)) return false; // Ensure cart has an items array
	const productIds = new Set(); // Track unique product ID and color combinations
	return cart.items.every((item) => {
		if (
			item.quantity <= 0 || // Quantity must be positive
			!item.product || // Product must exist
			typeof item.product.price !== "number" || // Price must be a number
			typeof item.product.id !== "string" // Product ID must be a string
		) {
			return false;
		}
		const key = `${item.product.id}-${item.color}`; // Unique key for product ID and color
		if (productIds.has(key)) return false; // Duplicate product ID and color combination
		productIds.add(key);
		return true;
	});
};

// Initialize an empty cart structure
export const initializeEmptyCart = () => ({ items: [] });

// Update cart items by increasing or decreasing quantity based on product ID and color
export const updateCartItemQuantity = (items, productId, color, quantity) => {
	const existingItemIndex = items.findIndex(
		(item) => item.product === productId && item.color === color,
	);

	if (existingItemIndex >= 0) {
		// Update existing item
		const updatedItems = [...items];
		updatedItems[existingItemIndex] = {
			...updatedItems[existingItemIndex],
			quantity: Math.max(
				0,
				updatedItems[existingItemIndex].quantity + quantity,
			),
		};
		return updatedItems.filter((item) => item.quantity > 0);
	} else {
		// Add new item
		return [
			...items,
			{
				product: productId,
				quantity: Math.max(0, quantity),
				color: color,
			},
		];
	}
};

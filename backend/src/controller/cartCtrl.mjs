import Cart from "../models/cartModel.mjs";
import Product from "../models/productModel.mjs";

// Helper function to validate cart items
export const validateCartItems = async (items) => {
	const response = {
		success: true,
		errors: [],
	};

	if (!Array.isArray(items)) {
		response.success = false;
		response.errors.push("Cart items must be an array");
		return response;
	}

	for (const item of items) {
		if (!item.product || !item.quantity || !item.color) {
			response.success = false;
			response.errors.push("Each cart item must have product, quantity, and color");
		}
		if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
			response.success = false;
			response.errors.push("Quantity must be an integer greater than 0");
		}
	}

	return response;
};

// Helper function to ensure a cart exists for the user
const ensureCartExists = async (userId) => {
	// Find or create the cart
	const cart = await Cart.findOne({ user: userId });

	if (!cart) {
		// If no cart exists, create a new one with default values
		return await Cart.create({
			user: userId,
			items: [],
			cartTotal: 0,
		});
	}

	// Ensure the cart has valid default values
	if (!Array.isArray(cart.items)) {
		p;
		cart.items = [];
	}
	if (typeof cart.cartTotal !== "number") {
		cart.cartTotal = 0;
	}

	// Save the cart if any defaults were applied
	await cart.save();

	return cart;
};

// Create or update the cart
const createOrUpdateCart = async (req, res) => {
	// Retrieve users id from session
	const { _id } = req.user;
	// Get cart from body
	const { cart } = req.body;

	try {
		if (!cart || !cart.items) {
			return res.status(400).json({ success: false, message: "Invalid cart format" });
		}

		const validationResponse = await validateCartItems(cart.items);

		if (!validationResponse.success) {
			return res.status(400).json({ success: false, message: "Cart validation failed", details: validationResponse });
		}

		const existingCart = await ensureCartExists(_id);

		// Retrieve products
		const productIds = cart.items.map((item) => item.product);
		const products = await Product.find({ _id: { $in: productIds } }).select("_id price quantity color name slug status");

		const productsMap = products.reduce((map, product) => {
			map[product._id.toString()] = product;
			return map;
		}, {});

		const updatedItems = [...existingCart.items];

		for (const newItem of cart.items) {
			const product = productsMap[newItem.product];

			// Check if the product exists and is active
			if (!product || product.status !== "active") {
				return res.status(400).json({
					success: false,
					message: `Product with ID ${newItem.product} is unavailable or inactive`,
				});
			}

			// Check if the requested quantity is within stock limits
			if (newItem.quantity > product.quantity) {
				return res.status(400).json({
					success: false,
					message: `Requested quantity for product '${product.name}' exceeds available stock (${product.quantity})`,
				});
			}

			// Check if the requested color is available for the product
			if (!product.color.includes(newItem.color)) {
				return res.status(400).json({
					success: false,
					message: `Color '${newItem.color}' is not available for product '${product.name}'`,
				});
			}

			const existingItemIndex = updatedItems.findIndex((item) => item.product.toString() === newItem.product && item.color === newItem.color);

			if (existingItemIndex !== -1) {
				const newQuantity = updatedItems[existingItemIndex].quantity + newItem.quantity;
				if (newQuantity > product.quantity) {
					return res.status(400).json({
						success: false,
						message: `Adding ${newItem.quantity} more items for product '${product.name}' exceeds stock limit`,
					});
				}
				updatedItems[existingItemIndex].quantity = newQuantity;
			} else {
				updatedItems.push({
					product: product._id,
					quantity: newItem.quantity,
					color: newItem.color,
					price: product.price,
					name: product.name,
					slug: product.slug,
				});
			}
		}

		existingCart.items = updatedItems;
		existingCart.cartTotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

		await existingCart.save();

		return res.status(200).json({
			success: true,
			message: "Cart updated successfully",
			cart: existingCart,
		});
	} catch (error) {
		return res.json({ error: error });
	}
};

// Define getUserCart function that allows authenticated users to
// retrieve all details of their existing cart if any

const getUserCart = async (req, res, next) => {
	// Extract user ID from the request
	const { _id } = req.user;

	try {
		// Find the cart using users ID
		const existingCart = await Cart.findOne({ user: _id });

		if (existingCart.items.length === 0) {
			// Return a message indicating the cart is empty
			return res.status(200).json({ success: true, message: "Cart is empty", cart: existingCart });
		}

		// Return the cart details
		return res.status(200).json({
			success: true,
			message: "Cart retrieved successfully",
			cart: existingCart,
		});
	} catch (error) {
		next(error);
	}
};

// Define clearCart function that allows authenticated users to remove
// all items from their cart

const clearCart = async (req, res, next) => {
	// Extract user ID from the request
	const { _id } = req.user;

	try {
		// Find the cart using users ID
		const existingCart = await ensureCartExists(_id);

		if (existingCart.items.length === 0) {
			// Return a message indicating the cart is empty
			return res.status(200).json({ success: true, message: "Cart is empty. Nothing to clear.", cart: existingCart });
		}

		// Use the cart model's method to clear the cart
		await existingCart.clearCart();

		// Return a success message
		return res.status(200).json({ success: true, message: "Cart successfully cleared" });
	} catch (error) {
		next(error);
	}
};

// Define removeProductFromCart that allows authenticated users to remove
// a single product based on its id from cart

const removeProductFromCart = async (req, res, next) => {
	// Extract user ID and product ID from the request
	const { _id } = req.user;
	const { id: productID } = req.params;

	try {
		// Find the cart using users ID
		const existingCart = await ensureCartExists(_id);

		if (existingCart.items.length === 0) {
			// Return a message indicating the cart is empty
			return res.status(200).json({ success: true, message: "Cart is empty. No Product to remove.", cart: existingCart });
		}

		// Find the index of the product in the cart items array
		const productIndex = existingCart.items.findIndex((item) => item.product.toString() === productID);

		if (productIndex === -1) {
			// Return 404 if the product is not found in the cart
			return res.status(404).json({ success: false, message: "Product Not Found in Cart" });
		}

		// Use the cart model's method to remove the product
		await existingCart.removeItem(productID);

		// Return a success message with updated cart details
		return res.status(200).json({
			success: true,
			message: "Product successfully removed from cart",
			cart: existingCart,
		});
	} catch (error) {
		next(error);
	}
};

export { createOrUpdateCart, getUserCart, clearCart, removeProductFromCart };

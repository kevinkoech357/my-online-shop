import Cart from "../models/cartModel.mjs";
import Product from "../models/productModel.mjs";
import User from "../models/userModel.mjs";

import mongoose from "mongoose";

// Define userCart function that will enable an authenticated user
// to add or update items in his/her cart

const userCart = async (req, res, next) => {
	// Get user ID from the request
	const { _id } = req.user;
	// Get cart details from the request body
	const { cart } = req.body;

	try {
		// Find the user by ID
		const user = await User.findById(_id);
		// If user not found, return 404
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found" });
		}

		// Retrieve existing cart or initialize a new one
		let existingCart = await Cart.findOne({ user: _id });
		if (!existingCart) {
			existingCart = new Cart({ user: _id, items: [], cartTotal: 0 });
		}

		// Retrieve all products needed for the cart in one query
		const productIds = cart.items.map((item) => item.product);
		const products = await Product.find({ _id: { $in: productIds } }).select(
			"_id price quantity color",
		);

		// Create a map of products for quick lookup
		const productsMap = products.reduce((map, product) => {
			map[product._id.toString()] = product;
			return map;
		}, {});

		// Initialize an array to hold updated items
		const updatedItems = [];
		for (const newItem of cart.items) {
			// Lookup the product in the map
			const product = productsMap[newItem.product];
			// If product not found, return 404
			if (!product) {
				return res.status(404).json({
					success: false,
					message: `Product Not Found`,
				});
			}

			// Validate quantity
			if (newItem.quantity <= 0 || !Number.isInteger(newItem.quantity)) {
				return res.status(400).json({
					success: false,
					message: "Quantity must be an Integer greater than or equal to 1.",
				});
			}

			// Check if quantity exceeds available stock
			if (newItem.quantity > product.quantity) {
				return res.status(400).json({
					success: false,
					message: `Quantity exceeds the available stock for product ${newItem.product}.`,
				});
			}

			// Check if color is available
			if (newItem.color !== product.color) {
				return res.status(400).json({
					success: false,
					message: "Sorry. Requested color not available in stock.",
				});
			}

			// Add the valid item to updatedItems
			updatedItems.push({
				product: product._id,
				quantity: newItem.quantity,
				color: newItem.color,
				price: product.price,
			});
		}

		// Update cart items and total
		existingCart.items = updatedItems;
		existingCart.cartTotal = updatedItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);

		// Save the updated cart
		await existingCart.save();

		// Respond with the updated or new cart
		return res.status(200).json({
			success: true,
			message: existingCart.isNew ? "New Cart Created" : "Cart Updated",
			cart: existingCart,
		});
	} catch (error) {
		next(error);
	}
};

// Define getUserCart function that allows authenticated users to
// retrieve all details of their existing cart if any

const getUserCart = async (req, res, next) => {
	// Extract user ID from the request
	const { _id } = req.user;

	try {
		// Find the user by ID
		const user = await User.findById(_id);
		if (!user) {
			// Return 404 if the user is not found
			return res
				.status(404)
				.json({ success: false, message: "User Not Found" });
		}

		// Retrieve the user's cart and populate product details
		const existingCart = await Cart.findOne({ user: _id }).populate({
			path: "items.product",
			select: "_id name price color",
		});

		if (!existingCart) {
			// Return 404 if the cart is not found
			return res
				.status(404)
				.json({ success: false, message: "Cart Not Found" });
		}

		if (existingCart.items.length === 0) {
			// Return a message indicating the cart is empty
			return res.status(200).json({ success: true, message: "Cart is empty" });
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
		// Find the user by ID
		const user = await User.findById(_id);
		if (!user) {
			// Return 404 if the user is not found
			return res
				.status(404)
				.json({ success: false, message: "User Not Found" });
		}

		// Retrieve the user's cart
		const existingCart = await Cart.findOne({ user: _id });
		if (!existingCart) {
			// Return 404 if the cart is not found
			return res
				.status(404)
				.json({ success: false, message: "Cart Not Found" });
		}

		if (existingCart.items.length === 0) {
			// Return a message indicating the cart is empty
			return res
				.status(200)
				.json({ success: true, message: "Cart is empty. Nothing to clear." });
		}

		// Use the cart model's method to clear the cart
		await existingCart.clearCart();

		// Return a success message
		return res
			.status(200)
			.json({ success: true, message: "Cart successfully cleared" });
	} catch (error) {
		next(error);
	}
};

// Define removeProductFromCart that allows authenticated users to remove
// a single product based on its id from cart

const removeProductFromCart = async (req, res, next) => {
	// Extract user ID and product ID from the request
	const { _id } = req.user;
	const { productID } = req.body;

	try {
		// Find the user by ID
		const user = await User.findById(_id);
		if (!user) {
			// Return 404 if the user is not found
			return res
				.status(404)
				.json({ success: false, message: "User Not Found" });
		}

		// Validate productID
		const isValid = mongoose.Types.ObjectId.isValid(productID);
		// Invalid id
		if (!isValid) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid Product ID." });
		}

		// Retrieve the user's cart
		const existingCart = await Cart.findOne({ user: _id });
		if (!existingCart) {
			// Return 404 if the cart is not found
			return res
				.status(404)
				.json({ success: false, message: "Cart Not Found" });
		}

		if (existingCart.items.length === 0) {
			// Return a message indicating the cart is empty
			return res.status(200).json({
				success: true,
				message: "Cart is empty. No product to remove.",
			});
		}

		// Find the index of the product in the cart items array
		const productIndex = existingCart.items.findIndex(
			(item) => item.product.toString() === productID,
		);

		if (productIndex === -1) {
			// Return 404 if the product is not found in the cart
			return res
				.status(404)
				.json({ success: false, message: "Product Not Found" });
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

export { userCart, getUserCart, clearCart, removeProductFromCart };

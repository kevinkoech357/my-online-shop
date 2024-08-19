import uniqid from "uniqid";
import Cart from "../models/cartModel.mjs";
import Order from "../models/orderModel.mjs";
import Product from "../models/productModel.mjs";
import User from "../models/userModel.mjs";

// Define createNewOrder that allows authenticated users to
// create a new order based on products in their cart

const createNewOrder = async (req, res, next) => {
	// Get user id from the session
	const { _id } = req.user;
	// Get paymentMethod from the body
	const { paymentMethod } = req.body;

	try {
		// Validate paymentMethod
		const availablePaymentMethods = ["Cash On Delivery", "M-PESA"];
		if (!availablePaymentMethods.includes(paymentMethod)) {
			return res.status(400).json({
				success: false,
				message: "Invalid payment method.",
			});
		}
		// Find user
		const user = await User.findById(_id);
		// Return 404 if user not found
		if (!user) {
			return res.status(404).json({ success: false, message: "User Not Found" });
		}

		// Find the user's cart
		const userCart = await Cart.findOne({ user: user._id });

		if (!userCart) {
			return res.status(404).json({
				success: false,
				message: "Cart not found.",
			});
		}

		// Calculate the final amount
		const finalAmount = userCart.cartTotal;

		// Create a new order
		const newOrder = new Order({
			products: userCart.items,
			paymentIntent: {
				id: uniqid(),
				paymentMethod: paymentMethod,
				amount: finalAmount,
				status: paymentMethod === "Cash On Delivery" ? "Created" : "Succeeded",
				created: Date.now(),
				currency: "KES",
			},
			orderedBy: user._id,
			orderStatus: paymentMethod === "Cash On Delivery" ? "Not Processed" : "Pending",
		});

		await newOrder.save();

		// Clear the cart
		await userCart.clearCart();

		// Update product stock
		const update = userCart.items.map((item) => {
			return {
				updateOne: {
					filter: { _id: item.product._id },
					update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
				},
			};
		});
		await Product.bulkWrite(update, {});

		// Return success response
		res.status(201).json({
			success: true,
			message: "Order created successfully.",
			order: newOrder,
		});
	} catch (error) {
		next(error);
	}
};

// Define myOrders function that will enable authenticated users
// to retrieve their orders

const myOrders = async (req, res, next) => {
	// Get user id from session
	const { _id } = req.user;

	try {
		// Find user orders
		const orders = await Order.find({ orderedBy: _id }).populate("products.product", "name price").sort("-createdAt");

		if (!orders.length) {
			// Return 404 if no orders found
			return res.status(404).json({
				success: false,
				message: "No orders Found.",
			});
		}

		// Return success response
		res.status(200).json({
			success: true,
			message: "Orders retrieved successfully",
			totaOrders: orders.length,
			orders: orders,
		});
	} catch (error) {
		next(error);
	}
};

// Define allOrders function that will enable admins
// to retrieve all orders placed

const allOrders = async (req, res, next) => {
	try {
		// Implement pagination
		const page = Number.parseInt(req.query.page) || 1;
		const limit = Number.parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Find all orders
		const orders = await Order.find().populate("orderedBy", "name email").sort("-createdAt").skip(skip).limit(limit);

		// Find total count
		const total = await Order.countDocuments();

		// Return success response
		res.status(200).json({
			success: true,
			message: "All orders retrieved successfully",
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			orders: orders,
		});
	} catch (error) {
		console.error("Error in allOrders:", error);
		next(error);
	}
};

export { createNewOrder, myOrders, allOrders };

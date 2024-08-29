import uniqid from "uniqid";
import Cart from "../models/cartModel.mjs";
import Location from "../models/locationModel.mjs";
import Order from "../models/orderModel.mjs";
import Product from "../models/productModel.mjs";
import User from "../models/userModel.mjs";

// Define createNewOrder that allows authenticated users to
// create a new order based on products in their cart

const createNewOrder = async (req, res, next) => {
	// Get user id from the session
	const { _id } = req.user;
	// Get paymentMethod from the body
	const { paymentMethod, deliveryAddress, county, town, deliveryNotes } = req.body;

	try {
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

		// Check if the cart is empty
		if (userCart.items.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Cart is empty. Add items to the cart before placing an order.",
			});
		}

		// Validate paymentMethod
		const availablePaymentMethods = ["Cash On Delivery", "M-PESA"];
		if (!availablePaymentMethods.includes(paymentMethod)) {
			return res.status(400).json({
				success: false,
				message: "Invalid payment method.",
			});
		}

		// Check if delivery location is available
		const deliveryLocation = await Location.findOne({
			name: deliveryAddress,
			county: county,
			town: town,
		});

		if (!deliveryLocation) {
			return res.status(400).json({
				success: false,
				message: "Delivery is not available to the specified location.",
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
			deliveryLocation: {
				name: deliveryAddress,
				county: county,
				town: town,
				notes: deliveryNotes,
			},
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

// Define viewOneOrder function that allows authenticated users
// to view details of a specific order based on its ID
const viewOneOrder = async (req, res, next) => {
	// Get user id from session
	const { _id: userId } = req.user;
	// Get order id from params
	const { id: orderId } = req.params;

	try {
		// Find the order and populate necessary fields
		const order = await Order.findOne({ _id: orderId, orderedBy: userId })
			.populate("products.product", "name price images")
			.populate("orderedBy", "name email");

		// If order not found or doesn't belong to the user
		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found or does not belong to the user.",
			});
		}

		// Return the order details
		res.status(200).json({
			success: true,
			message: "Order details retrieved successfully.",
			order: order,
		});
	} catch (error) {
		next(error);
	}
};

// Define cancelMyOrder function that allows users to cancel
// a particular order based on ID

const cancelMyOrder = async (req, res, next) => {
	// Get user id from session
	const { _id: userId } = req.user;
	// Get order id from params
	const { id: orderId } = req.params;
	try {
		// Find the order
		const order = await Order.findOne({ _id: orderId, orderedBy: userId });

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found or does not belong to the user.",
			});
		}

		// Check if the order can be cancelled
		const cancellableStatuses = ["Not Processed", "Processing", "Pending"];
		if (!cancellableStatuses.includes(order.orderStatus)) {
			return res.status(400).json({
				success: false,
				message: "Order cannot be cancelled in its current status.",
			});
		}

		// Update the order status to Cancelled
		await Order.findByIdAndUpdate(
			orderId,
			{ $set: { orderStatus: "Cancelled" } },
			{ new: true }, // Return the updated document
		);

		// Restore product stock
		const bulkOps = order.products.map((item) => ({
			updateOne: {
				filter: { _id: item.product },
				update: { $inc: { quantity: item.quantity, sold: -item.quantity } },
			},
		}));
		await Product.bulkWrite(bulkOps);

		res.status(200).json({
			success: true,
			message: "Order cancelled successfully.",
			order: order,
		});
	} catch (error) {
		console.error("Error in cancelMyOrder:", error);

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

		// Calculate total orders
		const totalOrders = orders.length;

		// Return success response
		res.status(200).json({
			success: true,
			message: "All orders retrieved successfully",
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			totalOrders: totalOrders,
			orders: orders,
		});
	} catch (error) {
		console.error("Error in allOrders:", error);
		next(error);
	}
};

// Define adminViewOneOrder function that allows admin users
// to view details of any specific order based on its ID
const adminViewOneOrder = async (req, res, next) => {
	// Get order id from params
	const { id: orderId } = req.params;

	try {
		// Find the order and populate necessary fields
		const order = await Order.findById(orderId)
			.populate("products.product", "name price images quantity")
			.populate("orderedBy", "name email phone")
			.populate("paymentIntent");

		// If order not found
		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found.",
			});
		}

		// Return the order details
		res.status(200).json({
			success: true,
			message: "Order details retrieved successfully.",
			order: order,
		});
	} catch (error) {
		next(error);
	}
};

// Define updateOrderStatus function that allows admins
// to update the status of a particular order based on its id

const updateOrderStatus = async (req, res, next) => {
	// Get order id from params
	const { id: orderId } = req.params;
	// Get new status from body
	const { newStatus } = req.body;

	try {
		// Validate newStatus
		const validStatuses = ["Not Processed", "Processing", "Dispatched", "Cancelled", "Delivered"];
		if (!validStatuses.includes(newStatus)) {
			return res.status(400).json({
				success: false,
				message: "Invalid order status.",
			});
		}

		// Find and update the order
		const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { orderStatus: newStatus } }, { new: true, runValidators: true });

		if (!updatedOrder) {
			return res.status(404).json({
				success: false,
				message: "Order not found.",
			});
		}

		// If order is cancelled, restore product stock
		if (newStatus === "Cancelled") {
			const bulkOps = updatedOrder.products.map((item) => ({
				updateOne: {
					filter: { _id: item.product },
					update: { $inc: { quantity: item.quantity, sold: -item.quantity } },
				},
			}));
			await Product.bulkWrite(bulkOps);
		}

		res.status(200).json({
			success: true,
			message: "Order status updated successfully.",
			order: updatedOrder,
		});
	} catch (error) {
		next(error);
	}
};

export { createNewOrder, myOrders, allOrders, updateOrderStatus, viewOneOrder, cancelMyOrder, adminViewOneOrder };

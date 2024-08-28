import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";

const itemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: [true, "Product reference is required"],
		validate: {
			validator: isValidObjectId,
			message: "Invalid product ID",
		},
	},
	quantity: {
		type: Number,
		required: [true, "Quantity is required"],
		min: [1, "Quantity must be at least 1"],
		max: [100, "Quantity cannot exceed 100"],
		validate: {
			validator: Number.isInteger,
			message: "Quantity must be an integer",
		},
	},
	color: {
		type: String,
		required: [true, "Color is required"],
		trim: true,
		maxlength: [50, "Color cannot exceed 50 characters"],
	},
	price: {
		type: Number,
		required: [true, "Price is required"],
		min: [0, "Price cannot be negative"],
	},
});

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User reference is required"],
			validate: {
				validator: isValidObjectId,
				message: "Invalid user ID",
			},
		},
		items: [itemSchema],
		cartTotal: {
			type: Number,
			default: 0,
			min: [0, "Cart total can't be negative"],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Indexes for frequently queried fields
cartSchema.index({ user: 1 });

// Virtual for total item count
cartSchema.virtual("totalItems").get(function () {
	return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save hook to recalculate cart total
cartSchema.pre("save", function (next) {
	this.cartTotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
	next();
});

// Method to update cart items
cartSchema.methods.updateItems = function (newItems) {
	this.items = newItems;
	return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (productId) {
	this.items = this.items.filter((item) => item.product.toString() !== productId.toString());
	return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
	this.items = [];
	this.cartTotal = 0;
	return this.save();
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

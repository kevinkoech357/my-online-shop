import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";

const productSchema = new mongoose.Schema({
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
		required: [true, "Product quantity is required"],
		min: [1, "Count must be at least 1"],
		max: [100, "Count cannot exceed 100"],
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

const orderSchema = new mongoose.Schema(
	{
		products: {
			type: [productSchema],
			required: [true, "Products are required"],
			validate: [arrayMinLength, "Order must contain at least one product"],
		},
		paymentIntent: {
			id: { type: String, trim: true },
			status: {
				type: String,
				enum: ["Created", "Succeeded", "Failed"],
				default: "Created",
			},
			paymentMethod: {
				type: String,
				enum: ["Cash On Delivery", "M-PESA"],
				default: "Cash On Delivery",
			},
			amount: {
				type: Number,
				min: [0, "Amount cannot be negative"],
			},
			currency: {
				type: String,
				trim: true,
				uppercase: true,
				default: "KES",
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
		orderStatus: {
			type: String,
			default: "Not Processed",
			enum: ["Not Processed", "Pending", "Processing", "Dispatched", "Cancelled", "Delivered"],
		},
		orderedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User reference is required"],
			validate: {
				validator: isValidObjectId,
				message: "Invalid user ID",
			},
		},
		location: {
			name: { type: String, required: true },
			town: { type: String, required: true },
			county: { type: String, required: true },
			notes: String, // Optional delivery notes
		},
	},
	{
		timestamps: true,
	},
);

function arrayMinLength(val) {
	return val.length > 0;
}

// Indexes for frequently queried fields
orderSchema.index({ orderedBy: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ "paymentIntent.status": 1 });

// Virtual for total order amount
orderSchema.virtual("totalAmount").get(function () {
	return this.products.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Pre-save hook for any necessary calculations or validations
orderSchema.pre("save", function (next) {
	if (this.isModified("products")) {
		this.paymentIntent.amount = this.totalAmount;
	}
	next();
});

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus) {
	if (this.schema.path("orderStatus").enumValues.includes(newStatus)) {
		this.orderStatus = newStatus;
		return this.save();
	}
	throw new Error("Invalid order status");
};

const Order = mongoose.model("Order", orderSchema);

export default Order;

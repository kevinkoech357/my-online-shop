import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import { validateCartItems } from "../controller/cartCtrl.mjs";

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
	name: {
		type: String,
	},
	slug: {
		type: String,
	},
	lastModified: {
		type: Date,
		default: Date.now,
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
			unique: true,
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

// Virtual for total item count
cartSchema.virtual("totalItems").get(function () {
	return this.items ? this.items.reduce((total, item) => total + item.quantity, 0) : 0;
});

// Pre-save hook to recalculate cart total and handle product duplicates
cartSchema.pre("save", async function (next) {
	const uniqueItems = new Map();

	// Fetch product details for validation
	const productIds = this.items.map((item) => item.product);
	const products = await mongoose.model("Product").find({ _id: { $in: productIds } });

	const productsMap = products.reduce((map, product) => {
		map[product._id.toString()] = product;
		return map;
	}, {});

	for (const item of this.items) {
		const key = `${item.product}-${item.color}`;
		const product = productsMap[item.product.toString()];

		if (!product) {
			throw new Error(`Product with ID ${item.product} not found`);
		}

		// Validate price
		if (item.price !== product.price) {
			throw new Error(`Price mismatch for product ${item.product}. Expected ${product.price}, got ${item.price}`);
		}

		if (!uniqueItems.has(key)) {
			uniqueItems.set(key, item);
		} else {
			const existingItem = uniqueItems.get(key);
			existingItem.quantity += item.quantity;
		}
	}

	this.items = Array.from(uniqueItems.values());
	this.cartTotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);

	next();
});

// Method to update cart items
cartSchema.methods.updateItems = async function (newItems) {
	const validationResponse = await validateCartItems(newItems); // Use the helper function from the controller
	if (!validationResponse.success) {
		throw new Error(validationResponse.errors.join(", "));
	}

	this.items = newItems;
	return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (productId) {
	if (!mongoose.isValidObjectId(productId)) {
		throw new Error("Invalid product ID");
	}

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

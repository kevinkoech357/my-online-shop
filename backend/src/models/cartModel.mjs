import mongoose from "mongoose";

// Define Cart Modelling Schema

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
				},
				color: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		cartTotal: {
			type: Number,
			default: 0,
			min: [0, "Cart total can't be negative"],
		},
	},
	{ timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

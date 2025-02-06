import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define productSchema for the Product Model
const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			minLength: 10,
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
			index: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		category: {
			type: String,
			required: true,
			index: true,
		},
		brand: {
			type: String,
			required: true,
			index: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		images: [
			{
				public_id: String,
				url: String,
			},
		],
		color: {
			type: String,
			required: true,
			enum: ["red", "blue", "green", "black", "white"],
		},
		ratings: [
			{
				star: {
					type: Number,
					min: 1,
					max: 5,
				},
				comment: String,
				postedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
		totalRating: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{ timestamps: true },
);

// Apply the mongoose-paginate-v2 plugin to the product schema
productSchema.plugin(mongoosePaginate);

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);
export default Product;

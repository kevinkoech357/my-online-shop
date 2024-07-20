import mongoose from "mongoose";

// Define Category model with only Title field

const productCategorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

const ProductCategory = mongoose.model(
	"ProductCategory",
	productCategorySchema,
);

export default ProductCategory;

import ProductCategory from "../models/productCategoryModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";

// ===================================================START ADMIN PRODUCT CATEGORY RELATED ACTIONS=========================================

// Admin function to create a new Product Category
const adminCreateProductCategory = async (req, res, next) => {
	const { title } = req.body;

	try {
		// Check if a category with the same title already exists
		const existingCategory = await ProductCategory.findOne({ title });
		if (existingCategory) {
			return res.status(409).json({
				success: false,
				message: "Product Category with the same title already exists",
			});
		}

		// Capitalize title
		const capitalizedTitle = await capitalizeFirstLetter(title);

		// Create a new ProductCategory instance
		const newProductCategory = new ProductCategory({ title: capitalizedTitle });

		// Save the new category to the database
		await newProductCategory.save();

		return res.status(201).json({
			success: true,
			message: "New Product Category created successfully",
			details: newProductCategory,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to modify a specific Product Category

const adminModifyProductCategory = async (req, res, next) => {
	const { id } = req.params;
	const { title } = req.body;

	try {
		// Capitalize title
		const capitalizedTitle = await capitalizeFirstLetter(title);

		// Find and update the product category
		const productCategoryToUpdate = await ProductCategory.findByIdAndUpdate(
			id,
			{ title: capitalizedTitle },
			{ new: true },
		);

		if (!productCategoryToUpdate) {
			// Return a 404 with not found message
			return res
				.status(404)
				.json({ success: false, message: "Product Category Not Found" });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Product Category Updated Successfully",
			details: productCategoryToUpdate,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to delete a specific Product Category

const adminDeleteProductCategory = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find and delete the product category
		const productCategoryToDelete = await ProductCategory.findByIdAndDelete(id);

		if (!productCategoryToDelete) {
			// Return a 404 with not found message
			return res
				.status(404)
				.json({ success: false, message: "Product Category Not Found" });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Product Category Deleted Successfully",
		});
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ADMIN PRODUCT CATEGORY RELATED ACTIONS==============================

// ==========================================================START ANY-USER PRODUCT CATEGORY RELATED ACTIONS==========================

// Function to get all product categories (accessible by any user)

const getAllProductCategories = async (_req, res, next) => {
	try {
		// Find all available Product Categories
		const allProductCategories = await ProductCategory.find();

		if (!allProductCategories) {
			// Return a 200 code with empty array
			return res.status(200).json({
				success: true,
				message: "No Product Categories Found.",
				details: [],
			});
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Product Category Retrieved Successfully",
			details: allProductCategories,
		});
	} catch (error) {
		next(error);
	}
};

// Function to get a single product category (accessible by any user)

const viewOneProductCategory = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find specific product category based on ID
		const productCategory = await ProductCategory.findById(id);

		if (!productCategory) {
			// Return 404
			return res
				.status(404)
				.json({ success: false, message: "Product Category Not Found" });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Product Category successfully retrieved",
			details: productCategory,
		});
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ANY-USER PRODUCT CATEGORY RELATED ACTIONS==============================

export {
	adminCreateProductCategory,
	adminModifyProductCategory,
	adminDeleteProductCategory,
	getAllProductCategories,
	viewOneProductCategory,
};

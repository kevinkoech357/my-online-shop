import path from "path";
import fs from "fs/promises";
import slugify from "slugify";
import Product from "../models/productModel.mjs";
import User from "../models/userModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";
import {
	cloudinaryDeleteImage,
	cloudinaryUploadImage,
} from "../utils/cloudinaryConfig.mjs";

// ===================================================START ADMIN PRODUCT RELATED ACTIONS=======================================

// Admin function to create a new product
const adminCreateProduct = async (req, res, next) => {
	// Destructure body
	const { name, description, quantity, brand, color, price, category } =
		req.body;
	try {
		// Capitalize necessary fields
		const capitalizedName = await capitalizeFirstLetter(name);
		const capitalizedDescription = await capitalizeFirstLetter(description);
		const capitalizedBrand = await capitalizeFirstLetter(brand);

		// Create slug
		const slug = slugify(name, {
			replacement: "-",
			lower: true,
		});

		// Create new Product
		const newProduct = new Product({
			name: capitalizedName,
			description: capitalizedDescription,
			slug,
			quantity,
			brand: capitalizedBrand,
			color,
			price,
			category,
		});

		// Save the new product to the database
		await newProduct.save();

		// Return a valid response with new product details
		return res.status(201).json({
			success: true,
			message: "New Product successfully added",
			details: newProduct,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to modify specific product details based on ID
const adminModifyProduct = async (req, res, next) => {
	// Get product id from params
	const { id } = req.params;
	try {
		// Check if the name field is being modified
		if (req.body.name) {
			// Generate the new slug based on the modified name
			req.body.slug = slugify(req.body.name, {
				replacement: "-",
				lower: true,
			});
		}
		const modifiedProduct = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		if (!modifiedProduct) {
			// If product not found, send a 404 response
			return res
				.status(404)
				.json({ success: false, message: "Product not found." });
		}

		// Send success response
		return res.status(200).json({
			success: true,
			message: "Product details successfully modified.",
			details: modifiedProduct,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to delete a specific product based on ID
const adminDeleteProduct = async (req, res, next) => {
	const { id } = req.params;
	try {
		const product = await Product.findByIdAndDelete(id);

		if (!product) {
			// If product not found, send a 404 response
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		// Send success response
		return res
			.status(200)
			.json({ success: true, message: "Product successfully deleted" });
	} catch (error) {
		next(error);
	}
};

// Admin function to upload images for a specific product based on its ID
const adminUploadProductImages = async (req, res, next) => {
	const { id } = req.params; // Product ID

	try {
		const rootDir = path.resolve();

		const files = req.files;
		if (!Array.isArray(files) || files.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "No files attached to the request." });
		}

		const imageUrls = [];
		for (const file of files) {
			const filePath = path.join(
				rootDir,
				"uploads/images/products",
				file.filename,
			);
			const uploadResult = await cloudinaryUploadImage(filePath);
			imageUrls.push(uploadResult);
			await fs.unlink(filePath);
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{ $push: { images: { $each: imageUrls } } },
			{ new: true },
		);

		if (!updatedProduct) {
			return res
				.status(404)
				.json({ success: false, message: "Product Not Found" });
		}

		return res.status(200).json({
			success: true,
			message: "Images successfully uploaded",
			details: updatedProduct,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to delete one image from a Product based on its ID
const adminDeleteProductImage = async (req, res, next) => {
	const { id } = req.params; // Product ID
	const { imageID } = req.body; // Image ID

	try {
		// Find the product by ID
		const product = await Product.findById(id);

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		// Find the index of the image to delete
		const imageIndex = product.images.findIndex(
			(image) => image._id.toString() === imageID,
		);

		if (imageIndex === -1) {
			return res
				.status(404)
				.json({ success: false, message: "Image not found in the product" });
		}

		// Get the public ID of the image to delete
		const publicIdToDelete = product.images[imageIndex].public_id;

		// Delete the image from Cloudinary using the helper function
		const deleteResult = await cloudinaryDeleteImage(publicIdToDelete);

		if (!deleteResult.success) {
			return res.status(500).json({
				success: false,
				message: "Failed to delete image from Cloudinary",
			});
		}

		// Remove the image from the product's images array
		product.images.splice(imageIndex, 1);

		// Save the updated product
		const updatedProduct = await product.save();

		return res.status(200).json({
			success: true,
			message: "Image successfully deleted",
			details: updatedProduct,
		});
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ADMIN PRODUCT RELATED ACTIONS========================

// ==========================================================START ANY-USER PRODUCT RELATED ACTIONS==================

// Function to view a specific product by ID (accessible by any user)
const viewOneProduct = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Find the product by ID
		const product = await Product.findById(id);

		if (!product) {
			// If product not found, send a 404 response
			return res
				.status(404)
				.json({ success: false, message: "No product found" });
		}

		// Send success response with product details
		return res.status(200).json({
			success: true,
			message: "Product details successfully retrieved.",
			details: product,
		});
	} catch (error) {
		next(error);
	}
};

// Function to get all products (accessible by any user)
const getAllProducts = async (req, res, next) => {
	try {
		// Check if req.query is null or empty
		if (!req.query || Object.keys(req.query).length === 0) {
			// If no query parameters provided, return all products
			const allProducts = await Product.find();

			if (allProducts.length === 0) {
				return res
					.status(200)
					.json({ success: true, message: "No products available" });
			}

			// Send success response with all products
			return res.status(200).json({
				success: true,
				message: "All products successfully retrieved.",
				products: allProducts,
			});
		}

		// Get query parameters
		const {
			page = 1,
			limit = 10,
			sortBy = "createdAt",
			order = "asc",
			name,
			brand,
			category,
			minPrice,
			maxPrice,
		} = req?.query;

		// Build query options
		const options = {
			page: parseInt(page, 10),
			limit: parseInt(limit, 10),
			sort: {
				[sortBy]: order === "asc" ? 1 : -1,
			},
		};

		// Filter products based on query parameters
		const query = {};

		if (name) {
			query.name = new RegExp(name, "i");
		}

		if (brand) {
			query.brand = new RegExp(brand, "i");
		}

		if (category) {
			query.category = new RegExp(category, "i");
		}

		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) {
				query.price.$gte = parseFloat(minPrice);
			}
			if (maxPrice) {
				query.price.$lte = parseFloat(maxPrice);
			}
		}

		// Retrieve paginated and filtered products
		const allProducts = await Product.paginate(query, options);

		// Check if products are found
		if (allProducts.docs.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No products matching the criteria available.",
			});
		}

		// Send success response with filtered products
		return res.status(200).json({
			success: true,
			message: "Products successfully retrieved.",
			products: allProducts,
		});
	} catch (error) {
		next(error);
	}
};

// Define addToWishlist function that allows authenticated users to add
// different products to their wishlist

const addToWishlist = async (req, res, next) => {
	// Get _id from user session
	const { _id } = req.user;
	// Get productID from req.body
	const { productID } = req.body;

	try {
		// Check if user exists based on ID
		const user = await User.findById(_id);

		if (!user) {
			// Return 404 if user not found
			return res
				.status(404)
				.json({ success: false, message: "User Not Found." });
		}

		// Check if product exists based on productID
		const product = await Product.findById(productID);

		if (!product) {
			// Return 404 if product not found
			return res
				.status(404)
				.json({ success: false, message: "Product Not Found." });
		}

		// Check if product has already been added to wishlist
		const productAlreadyAdded = user.wishlist.includes(productID);

		if (productAlreadyAdded) {
			// Remove product from wishlist
			const updatedUser = await User.findByIdAndUpdate(
				_id,
				{ $pull: { wishlist: productID } },
				{ new: true },
			);
			// Return response
			return res.status(200).json({
				success: true,
				message: "Product successfully removed from wishlist.",
				details: updatedUser,
			});
		} else {
			// Add product to wishlist
			const updatedUser = await User.findByIdAndUpdate(
				_id,
				{ $push: { wishlist: productID } },
				{ new: true },
			);
			// Return response
			return res.status(200).json({
				success: true,
				message: "Product successfully added to wishlist.",
				details: updatedUser,
			});
		}
	} catch (error) {
		next(error);
	}
};

// Define rateProduct that allows authenticated users
// to rate a specific product

const rateProduct = async (req, res, next) => {
	// Get _id from user session
	const { _id } = req.user;
	// Get product id from params
	const { id } = req.params;
	// Get star and comment from req.body
	const { star, comment } = req.body;

	try {
		// Check if user exists
		const user = await User.findById(_id);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found." });
		}

		// Check if product exists
		const product = await Product.findById(id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product Not Found." });
		}

		// Check if user has already rated the product
		const userRating = product.ratings.find(
			(ratingObj) => ratingObj.postedBy.toString() === _id.toString(),
		);

		if (userRating) {
			// Update existing user rating
			if (star) {
				userRating.star = star;
			}
			if (comment) {
				userRating.comment = comment;
			}
			userRating.userName = `${user.firstname} ${user.lastname}`;
		} else {
			// Add new rating
			product.ratings.push({
				star,
				comment,
				postedBy: _id,
				userName: `${user.firstname} ${user.lastname}`,
			});
		}

		// Calculate total rating
		const totalRatings = product.ratings.reduce(
			(acc, ratingObj) => acc + ratingObj.star,
			0,
		);
		product.totalRating = (totalRatings / product.ratings.length).toFixed(1);

		// Save the updated product
		await product.save();

		// Fetch updated product for response
		const updatedProduct = await Product.findById(id);

		return res.status(200).json({
			success: true,
			message: "Product rated successfully.",
			details: updatedProduct,
		});
	} catch (error) {
		next(error);
	}
};

// Define getProductRating that allows any user to view all posted
// Product ratings

const getProductRating = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find Product and populate ratings with user's firstname and lastname
		const product = await Product.findById(id).populate({
			path: "ratings.postedBy",
			select: "firstname lastname",
		});

		if (!product) {
			// Return 404 if product not found
			return res
				.status(404)
				.json({ success: false, message: "Product Not Found" });
		}

		// Prepare ratings array with user's full name
		const ratings = product.ratings.map((rating) => ({
			star: rating.star,
			comment: rating.comment,
			userName: rating.postedBy
				? `${rating.postedBy.firstname} ${rating.postedBy.lastname}`
				: "Unknown User",
		}));

		// Return products rating with count
		return res.status(200).json({
			success: true,
			message: "Product's ratings retrieved successfully",
			totalRating: product.totalRating,
			ratingsCount: product.ratings.length,
			ratings,
		});
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ANY-USER PRODUCT RELATED ACTIONS====================

export {
	adminCreateProduct,
	adminModifyProduct,
	adminDeleteProduct,
	viewOneProduct,
	getAllProducts,
	addToWishlist,
	rateProduct,
	adminUploadProductImages,
	adminDeleteProductImage,
	getProductRating,
};

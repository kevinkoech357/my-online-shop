import fs from "node:fs/promises";
import path from "node:path";
import slugify from "slugify";
import Product from "../models/productModel.mjs";
import User from "../models/userModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";
import { cloudinaryDeleteImage, cloudinaryUploadImage } from "../utils/cloudinaryConfig.mjs";

// ===================================================START ADMIN PRODUCT RELATED ACTIONS=======================================

// Admin function to create a new product
const adminCreateProduct = async (req, res, next) => {
	// Destructure body
	const { name, description, quantity, brand, color, price, category } = req.body;
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

		const duplicateSlug = await Product.findOne({ slug: slug });

		if (duplicateSlug) {
			return res.status(409).json({
				success: false,
				message: "Conflict. Product with the same name already exists.",
			});
		}

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
		console.error(error);
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
			return res.status(404).json({ success: false, message: "Product not found." });
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
			return res.status(404).json({ success: false, message: "Product not found" });
		}

		// Send success response
		return res.status(200).json({ success: true, message: "Product successfully deleted" });
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
			return res.status(400).json({ success: false, message: "No files attached to the request." });
		}

		const imageUrls = [];
		for (const file of files) {
			const filePath = path.join(rootDir, "uploads/images/products", file.filename);
			const uploadResult = await cloudinaryUploadImage(filePath);
			imageUrls.push(uploadResult);
			await fs.unlink(filePath);
		}

		const updatedProduct = await Product.findByIdAndUpdate(id, { $push: { images: { $each: imageUrls } } }, { new: true });

		if (!updatedProduct) {
			return res.status(404).json({ success: false, message: "Product Not Found" });
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
			return res.status(404).json({ success: false, message: "Product not found" });
		}

		// Find the index of the image to delete
		const imageIndex = product.images.findIndex((image) => image._id.toString() === imageID);

		if (imageIndex === -1) {
			return res.status(404).json({ success: false, message: "Image not found in the product" });
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
			return res.status(404).json({ success: false, message: "No product found" });
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
		// Helper function to build the query object
		const buildQuery = (params) => {
			const query = {};

			// Case-insensitive search for product name, brand, or category
			if (params.name) query.name = new RegExp(params.name, "i");
			if (params.brand) query.brand = new RegExp(params.brand, "i");
			if (params.category) query.category = new RegExp(params.category, "i");

			// Filtering by price range (if provided)
			if (params.minPrice || params.maxPrice) {
				query.price = {};
				if (params.minPrice) query.price.$gte = Number(params.minPrice);
				if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
			}

			return query;
		};

		// Helper function for pagination and sorting
		const getPaginationOptions = (params) => {
			const page = Number(params.page) || 1;
			const limit = Number(params.limit) || 20; // Default to 20 products per page
			const sortBy = params.sortBy || "createdAt"; // Sort by createdAt if no field is specified
			const order = params.order === "desc" ? -1 : 1; // Default to ascending order

			return {
				page,
				limit,
				sort: { [sortBy]: order },
			};
		};

		// Ensure parameters are validated
		const validateParams = (params) => {
			if (params.minPrice && Number.isNaN(params.minPrice)) {
				throw new Error("Invalid value for minPrice");
			}
			if (params.maxPrice && Number.isNaN(params.maxPrice)) {
				throw new Error("Invalid value for maxPrice");
			}
			if (params.page && Number.isNaN(params.page)) {
				throw new Error("Invalid value for page");
			}
			if (params.limit && Number.isNaN(params.limit)) {
				throw new Error("Invalid value for limit");
			}
		};

		// Validate query parameters
		validateParams(req.query);

		// Build the query and pagination options
		const query = buildQuery(req.query);
		const options = getPaginationOptions(req.query);

		// Retrieve products and total count
		const [paginatedProducts, totalProducts] = await Promise.all([
			Product.paginate(query, options), // Fetch paginated products
			Product.countDocuments(query), // Get total product count
		]);

		// If no products match the query, return a message
		if (paginatedProducts.docs.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No products matching the criteria available.",
				total: totalProducts,
				products: [],
			});
		}

		// Successful response with products
		return res.status(200).json({
			success: true,
			message: "Products successfully retrieved.",
			total: totalProducts,
			products: paginatedProducts.docs,
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
			return res.status(404).json({ success: false, message: "User Not Found." });
		}

		// Check if product exists based on productID
		const product = await Product.findById(productID);

		if (!product) {
			// Return 404 if product not found
			return res.status(404).json({ success: false, message: "Product Not Found." });
		}

		// Check if product has already been added to wishlist
		const productAlreadyAdded = user.wishlist.includes(productID);

		if (productAlreadyAdded) {
			// Remove product from wishlist
			const updatedUser = await User.findByIdAndUpdate(_id, { $pull: { wishlist: productID } }, { new: true });
			// Return response
			return res.status(200).json({
				success: true,
				message: "Product successfully removed from wishlist.",
				details: updatedUser,
			});
		}
		// Add product to wishlist
		const updatedUser = await User.findByIdAndUpdate(_id, { $push: { wishlist: productID } }, { new: true });
		// Return response
		return res.status(200).json({
			success: true,
			message: "Product successfully added to wishlist.",
			details: updatedUser,
		});
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
			return res.status(404).json({ success: false, message: "User Not Found." });
		}

		// Check if product exists
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ success: false, message: "Product Not Found." });
		}

		// Check if user has already rated the product
		const userRating = product.ratings.find((ratingObj) => ratingObj.postedBy.toString() === _id.toString());

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
		const totalRatings = product.ratings.reduce((acc, ratingObj) => acc + ratingObj.star, 0);
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
			return res.status(404).json({ success: false, message: "Product Not Found" });
		}

		// Prepare ratings array with user's full name
		const ratings = product.ratings.map((rating) => ({
			star: rating.star,
			comment: rating.comment,
			userName: rating.postedBy ? `${rating.postedBy.firstname} ${rating.postedBy.lastname}` : "Unknown User",
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

// Function to search a product based on name, brand or category

const searchProducts = async (req, res, next) => {
	try {
		// Extract search term from query parameters
		const { search } = req.query;

		// If no search term is provided, return an error
		if (!search) {
			return res.status(400).json({
				success: false,
				message: "Search term is required.",
			});
		}

		// Helper function for pagination and sorting
		const getPaginationOptions = (params) => ({
			page: Number(params.page) || 1,
			limit: Number(params.limit) || 20, // Default limit to 20
			sort: {
				[params.sortBy || "createdAt"]: params.order === "desc" ? -1 : 1,
			},
		});

		// Build query to search in name, category, and brand fields
		const query = {
			$or: [
				{ name: new RegExp(search, "i") }, // Case-insensitive search in product name
				{ category: new RegExp(search, "i") }, // Case-insensitive search in category
				{ brand: new RegExp(search, "i") }, // Case-insensitive search in brand
			],
		};

		// Get pagination options
		const options = getPaginationOptions(req.query);

		// Retrieve products and total count based on the search query
		const [paginatedProducts, totalProducts] = await Promise.all([Product.paginate(query, options), Product.countDocuments(query)]);

		// If no products are found
		if (paginatedProducts.docs.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No products found matching the search term.",
				total: totalProducts,
				products: [],
			});
		}

		// Return products that match the search
		return res.status(200).json({
			success: true,
			message: "Products successfully retrieved.",
			total: totalProducts,
			products: paginatedProducts.docs,
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
	searchProducts,
};

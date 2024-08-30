import mongoose from "mongoose";
import isInteger from "../utils/isInteger.mjs";

// Middleware for validating if required body fields are present
const checkRequiredFields = (requiredFields) => (req, res, next) => {
	// Check if all required fields are present in req.body
	for (const field of requiredFields) {
		if (!req.body[field]) {
			return res.status(400).json({ success: false, message: `Missing required field: ${field}` });
		}
	}
	next(); // Proceed to the next middleware or route handler
};

// Middleware for validating if firstname, lastname and password are of required length
const checkFieldLength = (req, res, next) => {
	const minFieldLengths = { firstname: 3, lastname: 3, password: 8 };

	// Check if any required field length is less than the minimum length
	for (const field in minFieldLengths) {
		if (req.body[field] && req.body[field].length < minFieldLengths[field]) {
			return res.status(400).json({
				success: false,
				message: `${field} must be at least ${minFieldLengths[field]} characters long.`,
			});
		}
	}
	next();
};

// Middleware for validating if ProductID
const validateProductID = (req, res, next) => {
	const { productID } = req.body;

	// Validate productID
	const isValid = mongoose.Types.ObjectId.isValid(productID);
	// Invalid id
	if (!isValid) {
		return res.status(400).json({ success: false, message: "Invalid ID parameter." });
	}

	next();
};

// Middleware for validating star and comments before rating a product
const validateRatingDetails = (req, res, next) => {
	const { star, comment } = req.body;

	// Validate star rating (if provided)
	if (star !== undefined) {
		if (star < 1 || star > 5 || !Number.isInteger(star)) {
			return res.status(400).json({
				success: false,
				message: "Rating must be an integer between 1 and 5.",
			});
		}
	}

	// Validate comment length (if provided)
	const minCommentLength = 10;
	const maxCommentLength = 300;

	if (comment !== undefined) {
		if (comment.length < minCommentLength) {
			return res.status(400).json({
				success: false,
				message: `Comment must be at least ${minCommentLength} characters long.`,
			});
		}
		if (comment.length > maxCommentLength) {
			return res.status(400).json({
				success: false,
				message: `Comment must be less than ${maxCommentLength} characters long.`,
			});
		}
	}

	next();
};

// Middleware to validate if quantity and price are integers
const validateIntegerFields = (req, res, next) => {
	console.log("Request body:", req.body);
	const { quantity, price } = req.body;

	console.log("Quantity:", quantity, "Type:", typeof quantity);
	console.log("Price:", price, "Type:", typeof price);

	// Convert to numbers
	const quantityNum = Number(quantity);
	const priceNum = Number(price);

	console.log("Quantity as number:", quantityNum, "Is integer:", Number.isInteger(quantityNum));
	console.log("Price as number:", priceNum, "Is integer:", Number.isInteger(priceNum));

	if (Number.isNaN(quantityNum) || Number.isNaN(priceNum) || !Number.isInteger(quantityNum) || !Number.isInteger(priceNum)) {
		return res.status(400).json({
			success: false,
			message: "Quantity and price must be integers",
			details: {
				quantity: { value: quantity, parsed: quantityNum },
				price: { value: price, parsed: priceNum },
			},
		});
	}

	req.body.quantity = quantityNum;
	req.body.price = priceNum;

	next();
};

export { checkFieldLength, checkRequiredFields, validateProductID, validateRatingDetails, validateIntegerFields };

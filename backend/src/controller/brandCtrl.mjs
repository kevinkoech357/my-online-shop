import Brand from "../models/brandModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";

// ===================================================START ADMIN BRAND RELATED ACTIONS=========================================

// Admin function to create a new Brand
const adminCreateBrand = async (req, res, next) => {
	const { title } = req.body;

	try {
		// Check if a Brand with the same title already exists
		const existingBrand = await Brand.findOne({ title });
		if (existingBrand) {
			return res.status(409).json({
				success: false,
				message: "Brand with the same title already exists",
			});
		}

		// Capitalize title
		const capitalizedTitle = await capitalizeFirstLetter(title);

		// Create a new Brand instance
		const newBrand = new Brand({ title: capitalizedTitle });

		// Save the new Brand to the database
		await newBrand.save();

		return res.status(201).json({
			success: true,
			message: "New Brand created successfully",
			details: newBrand,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to modify a specific Brand

const adminModifyBrand = async (req, res, next) => {
	const { id } = req.params;
	const { title } = req.body;

	try {
		// Capitalize title
		const capitalizedTitle = await capitalizeFirstLetter(title);

		// Find and update the Brand
		const brandToUpdate = await Brand.findByIdAndUpdate(id, { title: capitalizedTitle }, { new: true });

		if (!brandToUpdate) {
			// Return a 404 with not found message
			return res.status(404).json({ success: false, message: "Brand Not Found" });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Brand Updated Successfully",
			details: brandToUpdate,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to delete a specific Brand

const adminDeleteBrand = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find and delete the Brand
		const brandToDelete = await Brand.findByIdAndDelete(id);

		if (!brandToDelete) {
			// Return a 404 with not found message
			return res.status(404).json({ success: false, message: "Brand Not Found" });
		}

		// Return a success response
		return res.status(200).json({ success: true, message: "Brand Deleted Successfully" });
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ADMIN BRAND RELATED ACTIONS==============================

// ==========================================================START ANY-USER BRAND RELATED ACTIONS==========================

// Function to get all Brands (accessible by any user)

const getAllBrands = async (_req, res, next) => {
	try {
		// Find all available Brands
		const allBrands = await Brand.find();

		if (!allBrands) {
			// Return a 200 code with empty array
			return res.status(200).json({ success: true, message: "No Brands Found.", details: [] });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Brand Retrieved Successfully",
			details: allBrands,
		});
	} catch (error) {
		next(error);
	}
};

// Function to get a single Brand (accessible by any user)

const viewOneBrand = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find specific Brand based on ID
		const brand = await Brand.findById(id);

		if (!brand) {
			// Return 404
			return res.status(404).json({ success: false, message: "Brand Not Found" });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Brand successfully retrieved",
			details: brand,
		});
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ANY-USER BRAND RELATED ACTIONS==============================

export { adminCreateBrand, adminModifyBrand, adminDeleteBrand, getAllBrands, viewOneBrand };

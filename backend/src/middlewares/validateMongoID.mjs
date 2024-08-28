import mongoose from "mongoose";

const validateMongoID = async (req, res, next) => {
	// Get id from params
	const { id } = req.params;
	// Validate id
	const isValid = mongoose.Types.ObjectId.isValid(id);
	// Invalid id
	if (!isValid) {
		return res.status(400).json({ success: false, message: "Invalid ID parameter." });
	}
	// Id is valid
	next();
};

export default validateMongoID;

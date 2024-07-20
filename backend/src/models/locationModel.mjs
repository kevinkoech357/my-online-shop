import mongoose from "mongoose";

// Define Location model with only Title field

const locationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		county: {
			type: String,
			required: true,
		},
		town: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Location = mongoose.model("Location", locationSchema);

export default Location;

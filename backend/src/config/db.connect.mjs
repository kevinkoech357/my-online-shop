import mongoose from "mongoose";
import config from "../config.mjs";

const connectToMongoDB = async () => {
	const dbURL = config.mongoDbUrl;

	if (!dbURL) {
		console.log("No DB_URL ENV VAR Set!!");
		return;
	}

	try {
		await mongoose.connect(dbURL);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}
};

export default connectToMongoDB;

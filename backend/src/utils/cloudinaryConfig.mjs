import { v2 as cloudinary } from "cloudinary";
import config from "../config.mjs";

// Configure Cloudinary with values from config
cloudinary.config({
	cloud_name: config.cloudinary.name,
	api_key: config.cloudinary.apiKey,
	api_secret: config.cloudinary.apiSecret,
});

// Function to upload an image to Cloudinary
const cloudinaryUploadImage = async (fileToUpload) => {
	try {
		const result = await cloudinary.uploader.upload(fileToUpload, {
			folder: config.cloudinary.folder,
			resource_type: "image",
			allowed_formats: ["jpeg", "jpg", "png"],
		});

		return {
			url: result.secure_url,
			public_id: result.public_id,
		};
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Failed to upload image. Please try again later.");
	}
};

// Function to delete an image from Cloudinary
const cloudinaryDeleteImage = async (publicId) => {
	try {
		const result = await cloudinary.uploader.destroy(publicId);

		if (result.result === "ok") {
			console.log(`Image with public_id ${publicId} deleted successfully.`);
			return { success: true };
		}
		console.error(`Failed to delete image with public_id ${publicId}.`);
		throw new Error("Failed to delete image.");
	} catch (error) {
		console.error("Error deleting image:", error);
		throw new Error("Failed to delete image. Please try again later.");
	}
};

export { cloudinaryUploadImage, cloudinaryDeleteImage };

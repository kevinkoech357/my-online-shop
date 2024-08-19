import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import sharp from "sharp";
import createDirectory from "../utils/createDirectory.mjs";

// Define the root directory
const rootDir = path.resolve();

// Ensure that the uploads/images, uploads/images/products, and uploads/images/blogs directories exist
await createDirectory(path.join(rootDir, "uploads/images/products"));
await createDirectory(path.join(rootDir, "uploads/images/blogs"));

// Configuring multer storage
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		// Setting destination folder for uploads
		cb(null, path.join(rootDir, "uploads/images/"));
	},
	filename: (_req, file, cb) => {
		// Generating a unique filename with timestamp and random number
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${file.fieldname}-${uniqueSuffix}.jpeg`);
	},
});

// File filter to accept only images
const multerFilter = (_req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new Error("Unsupported file format"), false);
	}
};

// Configuring the multer middleware for file upload
const uploadPhoto = multer({
	storage,
	fileFilter: multerFilter,
	limits: { fileSize: 2000000 }, // Limit file size to 2MB
});

// Middleware to resize product images
const productImageResize = async (req, _res, next) => {
	if (!req.files) {
		return next();
	}
	await Promise.all(
		req.files.map(async (file) => {
			// Resize the image to 300x300 pixels and save it
			await sharp(file.path)
				.resize(300, 300)
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile(path.join(rootDir, `uploads/images/products/${file.filename}`));
			// Delete the original file
			await fs.unlink(file.path);
		}),
	);
	next();
};

// Middleware to resize blog images
const blogImageResize = async (req, _res, next) => {
	if (!req.files) {
		return next();
	}
	await Promise.all(
		req.files.map(async (file) => {
			// Resize the image to 300x300 pixels and save it
			await sharp(file.path)
				.resize(300, 300)
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile(path.join(rootDir, `uploads/images/blogs/${file.filename}`));
			// Delete the original file
			await fs.unlink(file.path);
		}),
	);
	next();
};

export { uploadPhoto, productImageResize, blogImageResize };

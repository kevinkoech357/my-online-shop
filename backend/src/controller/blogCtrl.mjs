import path from "path";
import fs from "fs/promises";
import Blog from "../models/blogModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";
import {
	cloudinaryDeleteImage,
	cloudinaryUploadImage,
} from "../utils/cloudinaryConfig.mjs";

// ===================================================START ADMIN BLOG RELATED ACTIONS=========================================

// Admin function to create a new blog
const adminWriteBlog = async (req, res, next) => {
	const { title, content, category } = req.body;

	try {
		// Capitalize the first letter of the blog title
		const capitalizedTitle = await capitalizeFirstLetter(title);

		// Create a new Blog instance
		const newBlog = new Blog({
			title: capitalizedTitle,
			content,
			category,
		});

		// Save the new blog to the database
		await newBlog.save();

		// Send success response
		return res.status(201).json({
			success: true,
			message: "New Blog Post created successfully",
			details: newBlog,
		});
	} catch (error) {
		// Pass any errors to the global error handler
		next(error);
	}
};

// Admin function to modify an existing blog by ID
const adminModifyBlog = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Find the blog by ID and update it with the request body
		const modifiedBlog = await Blog.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		if (!modifiedBlog) {
			// If Blog Post Not Found, send a 404 response
			return res
				.status(404)
				.json({ success: false, message: "Blog Post Not Found." });
		}

		// Send success response
		return res.status(200).json({
			success: true,
			message: "Blog Post successfully modified.",
			details: modifiedBlog,
		});
	} catch (error) {
		// Pass any errors to the global error handler
		next(error);
	}
};

// Admin function to delete a blog by ID
const adminDeleteBlog = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Find the blog by ID and delete it
		const blog = await Blog.findByIdAndDelete(id);

		if (!blog) {
			// If Blog Post Not Found, send a 404 response
			return res
				.status(404)
				.json({ success: false, message: "Blog Post Not Found" });
		}

		// Send success response
		return res
			.status(200)
			.json({ success: true, message: "Blog Post successfully deleted" });
	} catch (error) {
		// Pass any errors to the global error handler
		next(error);
	}
};

// Admin function to upload images for a specific product based on its ID
const adminUploadBlogImages = async (req, res, next) => {
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
				"uploads/images/blogs",
				file.filename,
			);
			const uploadResult = await cloudinaryUploadImage(filePath);
			imageUrls.push(uploadResult);
			await fs.unlink(filePath);
		}

		const { id } = req.params;
		const updatedBlog = await Blog.findByIdAndUpdate(
			id,
			{ $push: { images: { $each: imageUrls } } },
			{ new: true },
		);

		if (!updatedBlog) {
			return res
				.status(404)
				.json({ success: false, message: "Blog Not Found" });
		}

		return res.status(200).json({
			success: true,
			message: "Images successfully uploaded",
			details: updatedBlog,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to delete one image from a Blog based on its ID
const adminDeleteBlogImage = async (req, res, next) => {
	const { id } = req.params; // Blog ID
	const { imageID } = req.body; // Image ID

	try {
		// Find the blog by ID
		const blog = await Blog.findById(id);

		if (!blog) {
			return res
				.status(404)
				.json({ success: false, message: "Blog not found" });
		}

		// Find the index of the image to delete
		const imageIndex = blog.images.findIndex(
			(image) => image._id.toString() === imageID,
		);

		if (imageIndex === -1) {
			return res
				.status(404)
				.json({ success: false, message: "Image not found in the Blog" });
		}

		// Get the public ID of the image to delete
		const publicIdToDelete = blog.images[imageIndex].public_id;

		// Delete the image from Cloudinary using the helper function
		const deleteResult = await cloudinaryDeleteImage(publicIdToDelete);

		if (!deleteResult.success) {
			return res.status(500).json({
				success: false,
				message: "Failed to delete image from Cloudinary",
			});
		}

		// Remove the image from the blog's images array
		blog.images.splice(imageIndex, 1);

		// Save the updated blog
		const updatedBlog = await blog.save();

		return res.status(200).json({
			success: true,
			message: "Image successfully deleted",
			details: updatedBlog,
		});
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ADMIN BLOG RELATED ACTIONS==============================

// ==========================================================START ANY-USER BLOG RELATED ACTIONS==========================

// Function to get all blogs (accessible by any user)
const getAllBlogs = async (_req, res, next) => {
	try {
		// Find all blog posts in the database
		const allBlogPosts = await Blog.find();

		if (allBlogPosts.length === 0) {
			// If no blogs are found, send a 200 response with empty array
			return res
				.status(200)
				.json({ success: true, message: "No Blog Posts Found.", details: [] });
		}

		// Send success response with all blog posts
		return res.status(200).json({
			success: true,
			message: "All Blog Posts successfully retrieved.",
			blog: allBlogPosts,
		});
	} catch (error) {
		// Pass any errors to the global error handler
		next(error);
	}
};

// Function to view a specific blog by ID (accessible by any user)
const viewOneBlog = async (req, res, next) => {
	const { id } = req.params;
	try {
		// Find the blog by ID
		const blog = await Blog.findById(id);

		if (!blog) {
			// If Blog Post Not Found, send a 404 response
			return res
				.status(404)
				.json({ success: false, message: "Blog Post Not Found" });
		}

		// Send success response with blog details
		return res.status(200).json({
			success: true,
			message: "Blog Post successfully retrieved.",
			details: blog,
		});
	} catch (error) {
		// Pass any errors to the global error handler
		next(error);
	}
};

// ==========================================================END ANY-USER BLOG RELATED ACTIONS==============================

export {
	adminWriteBlog,
	adminModifyBlog,
	adminDeleteBlog,
	adminUploadBlogImages,
	adminDeleteBlogImage,
	getAllBlogs,
	viewOneBlog,
};

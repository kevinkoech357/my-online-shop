import Blog from '../models/blogModel.mjs';
import capitalizeFirstLetter from '../utils/capitalizeName.mjs';

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
      category
    });

    // Save the new blog to the database
    await newBlog.save();

    // Send success response
    res.status(201).json({ success: true, message: 'New Blog created successfully', details: newBlog });
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
    const modifiedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

    if (!modifiedBlog) {
      // If blog not found, send a 404 response
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    // Send success response
    return res.status(200).json({ success: true, message: 'Blog successfully modified.', details: modifiedBlog });
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
      // If blog not found, send a 404 response
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Send success response
    res.status(200).json({ success: true, message: 'Blog successfully deleted' });
  } catch (error) {
    // Pass any errors to the global error handler
    next(error);
  }
};

// ==========================================================END ADMIN BLOG RELATED ACTIONS==============================

// ==========================================================START ANY-USER BLOG RELATED ACTIONS==========================

// Function to get all blogs (accessible by any user)
const getAllBlogs = async (req, res, next) => {
  try {
    // Find all blog posts in the database
    const allBlogPosts = await Blog.find();

    if (allBlogPosts.length === 0) {
      // If no blogs are found, send a 204 response
      return res.status(204).send({ success: true, message: 'No Blog Posts available' });
    }

    // Send success response with all blog posts
    return res.status(200).json({ success: true, message: 'All Blog Posts successfully retrieved.', blog: allBlogPosts });
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
      // If blog not found, send a 404 response
      return res.status(404).json({ success: false, message: 'No blog found' });
    }

    // Send success response with blog details
    res.status(200).json({ success: true, message: 'Blog details successfully retrieved.', details: blog });
  } catch (error) {
    // Pass any errors to the global error handler
    next(error);
  }
};

// ==========================================================END ANY-USER BLOG RELATED ACTIONS==============================

export { adminWriteBlog, adminModifyBlog, adminDeleteBlog, getAllBlogs, viewOneBlog };

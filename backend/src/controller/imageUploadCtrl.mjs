import { cloudinaryUploadImage } from '../utils/cloudinaryConfig.mjs';
import Product from '../models/productModel.mjs';
import Blog from '../models/blogModel.mjs';

const adminUploadImages = async (req, res, next) => {
  try {
    // Extract resource type and ID from request body and params
    const { resourceType } = req.body;
    const { resourceId } = req.params;

    // Check if the resource (product or blog) exists
    let resource;
    switch (resourceType) {
      case 'product':
        resource = await Product.findById(resourceId);
        break;
      case 'blog':
        resource = await Blog.findById(resourceId);
        break;
      default:
        throw new Error('Invalid resource type');
    }

    // If the resource does not exist, return an error
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Product or Blog not found' });
    }

    // Upload the images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const imageUrl = await cloudinaryUploadImage(file.path, resourceType);
      imageUrls.push(imageUrl);
    }

    // Append the image URLs to the existing images array in the resource
    resource.images = [...resource.images, ...imageUrls];
    await resource.save();

    // Return a success response with details about the uploaded images and the updated resource
    res.json({
      success: true,
      message: 'Images uploaded successfully',
      totalImages: imageUrls.length,
      details: resource
    });
  } catch (error) {
    next(error);
  }
};

export { adminUploadImages };

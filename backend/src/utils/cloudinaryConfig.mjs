import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Function to upload an image to Cloudinary
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    // Attempt to upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder: process.env.CLOUDINARY_FOLDER,
      resource_type: 'image',
      allowed_formats: ['jpeg', 'png']
    });

    // Return the URL and public ID of the uploaded image
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to delete an image from Cloudinary
const cloudinaryDeleteImage = async (publicId) => {
  try {
    // Attempt to delete the image from Cloudinary using the provided public ID
    const result = await cloudinary.uploader.destroy(publicId);

    // Check the result of the deletion
    if (result.result === 'ok') {
      console.log(`Image with public_id ${publicId} deleted successfully`);
      return { success: true }; // Return success if the deletion was successful
    } else {
      console.error(`Error deleting image with public_id ${publicId}`);
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export { cloudinaryUploadImage, cloudinaryDeleteImage };

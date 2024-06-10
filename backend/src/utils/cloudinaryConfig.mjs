import cloudinary from 'cloudinary';

// Configure cloudinary
// First by getting env vars

const { CLOUDINARY_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

// Define cloudinaryUploadImage that will enable async
// upload of images

const cloudinaryUploadImage = async (fileToUpload, folderName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUpload, {
      folder: process.env.CLOUDINARY_FOLDER,
      resource_type: 'image'
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url
        });
      }
    });
  });
};

export { cloudinaryUploadImage };

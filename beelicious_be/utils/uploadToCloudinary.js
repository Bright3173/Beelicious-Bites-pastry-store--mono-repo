const cloudinary = require('../config/cloudinary');

const streamifier = require('streamifier');

const uploadToCloudinary = (file, folder = 'beelicious') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

module.exports = uploadToCloudinary;

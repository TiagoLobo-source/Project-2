const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["pdf", "png"],
    folder: "project-2", // The name of the folder in Cloudinary
    format: "pdf",
  },
});

const multerCloudinary = multer({ storage }); // Create multer instance for cloudinary

module.exports = {
  cloudinary,
  multerCloudinary,
};

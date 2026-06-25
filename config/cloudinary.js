//This is the configration with (Coludinary) with (multer-stroage-cloudinary)
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "AirBnb", //this will create the root directory of image in coludinary
    allFormate: ["png", "jpg", "jpeg", "pdf"], // this allow us to take the formate of the images
  },
});

module.exports = { cloudinary, storage };

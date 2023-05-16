const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const storageImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "papiro",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "webp", "mp4", "mov"],
  },
});

const uploadImage = multer({ storage: storageImage });

module.exports =  uploadImage
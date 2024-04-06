const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(imageData) {
  try {
    const originalBase64 = `data:image/jpeg;base64,${Buffer.from(imageData, "binary").toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(originalBase64, { resource_type: "image" });

    return uploadResult.secure_url;
  } catch (err) {
    console.error("Error in uploadImageToCloudinary: ", err.message);
    return false;
  }
}

module.exports = { uploadImageToCloudinary };

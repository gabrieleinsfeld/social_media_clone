const cloudinary = require("cloudinary").v2;
const db = require("../db/postQueries");
require("dotenv").config();
(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
})();
const multer = require("multer");
const fs = require("fs"); // Required to remove the file after uploading

// const upload = multer({ dest: "../uploads" }); // Temporary storage directory
const upload = multer({ dest: "/tmp" });
async function uploadFile(req, res, next) {
  const content = req.body.content;
  const userId = req.user.id;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
    });
    // Optionally remove the local file after uploading
    fs.unlinkSync(req.file.path);

    const autoCropUrl = cloudinary.url(result.public_id, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });
    const post = await db.createPost(autoCropUrl, content, userId);
    console.log(autoCropUrl);

    res.json({ post });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    next(error);
  }
}

module.exports = { uploadFile };

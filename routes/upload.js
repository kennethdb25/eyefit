const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary/cloudinary");
const { v4: uuidv4 } = require("uuid");
const streamifier = require("streamifier");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/upload-multiple",
  upload.array("images", 10),
  async (req, res) => {
    try {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "multi-images",
              public_id: `${uuidv4()}`,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                public_id: result.public_id,
                url: result.secure_url,
              });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      console.log(uploadedImages);
      res.status(200).json({ images: uploadedImages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

router.delete("/delete/:public_id", async (req, res) => {
  try {
    const { public_id } = req.params;
    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// (Optional) List images (requires Cloudinary API browsing permissions)
router.get("/list", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "my-images/",
      max_results: 10,
    });

    res.status(200).json(result.resources);
  } catch (error) {
    res.status(500).json({ error: "List failed" });
  }
});

module.exports = router;

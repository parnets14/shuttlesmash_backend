const galleryController = require("../../Controller/Admin/AdminGallery");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../Public/Gallery");

// Ensure directory exists at startup
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
console.log("Gallery upload path:", uploadPath);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Error-safe upload wrapper — prevents server crash on multer errors
const safeUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ msg: "Upload error: " + err.message });
    }
    next();
  });
};

router.post("/gallery", safeUpload, galleryController.gallery);
router.get("/getgallery", galleryController.getgallery);
router.delete("/Deletegallery/:Id", galleryController.Deletegallery);
router.put("/editgallery", safeUpload, galleryController.editgallery);
router.post("/Addgallery", safeUpload, galleryController.Addgallery);
router.delete("/deletegallery/:Id", galleryController.deletegallery);
router.put("/Editglry", safeUpload, galleryController.Editglry);
router.put("/updategallery", safeUpload, galleryController.updategallery);
router.put("/addgalleryimage", safeUpload, galleryController.updateglry);
router.delete("/deletegalleryimage", galleryController.DeleteGalleryImages);

module.exports = router;

const galleryHeroBannerController = require("../../Controller/Admin/GalleryHeroBanner");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/GalleryHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/addgalleryheroBanner",    upload.any(), galleryHeroBannerController.addHeroBanner);
router.get("/getgalleryheroBanner",     galleryHeroBannerController.getHeroBanner);
router.put("/editgalleryheroBanner",    upload.any(), galleryHeroBannerController.editHeroBanner);
router.delete("/deletegalleryheroBanner/:Id", galleryHeroBannerController.deleteHeroBanner);

module.exports = router;

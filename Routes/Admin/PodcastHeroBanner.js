const podcastHeroBannerController = require("../../Controller/Admin/PodcastHeroBanner");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/PodcastHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/addpodcastheroBanner",           upload.any(), podcastHeroBannerController.addHeroBanner);
router.get("/getpodcastheroBanner",            podcastHeroBannerController.getHeroBanner);
router.put("/editpodcastheroBanner",           upload.any(), podcastHeroBannerController.editHeroBanner);
router.delete("/deletepodcastheroBanner/:Id",  podcastHeroBannerController.deleteHeroBanner);

module.exports = router;

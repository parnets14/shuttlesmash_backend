const podcastAboutController = require("../../Controller/Admin/PodcastAbout");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/PodcastAbout"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/addpodcastabout",           upload.any(), podcastAboutController.addAbout);
router.get("/getpodcastabout",            podcastAboutController.getAbout);
router.put("/editpodcastabout",           upload.any(), podcastAboutController.editAbout);
router.delete("/deletepodcastabout/:Id",  podcastAboutController.deleteAbout);

module.exports = router;

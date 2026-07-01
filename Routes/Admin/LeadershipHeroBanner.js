const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const leadershipHeroBannerController = require("../../Controller/Admin/LeadershipHeroBanner");

const uploadPath = path.join(__dirname, "../../Public/LeadershipHeroBanner");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

router.post(  "/addleadershipheroBanner",          upload.any(), leadershipHeroBannerController.addHeroBanner);
router.get(   "/getleadershipheroBanner",                        leadershipHeroBannerController.getHeroBanner);
router.put(   "/editleadershipheroBanner",         upload.any(), leadershipHeroBannerController.editHeroBanner);
router.delete("/deleteleadershipheroBanner/:Id",                 leadershipHeroBannerController.deleteHeroBanner);

module.exports = router;

const overviewHeroBannerController = require("../../Controller/Admin/OverviewHeroBanner");
const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/OverviewHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(  "/addoverviewheroBanner",          upload.any(), overviewHeroBannerController.addHeroBanner);
router.get(   "/getoverviewheroBanner",                        overviewHeroBannerController.getHeroBanner);
router.put(   "/editoverviewheroBanner",         upload.any(), overviewHeroBannerController.editHeroBanner);
router.delete("/deleteoverviewheroBanner/:Id",                 overviewHeroBannerController.deleteHeroBanner);

module.exports = router;

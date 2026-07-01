const keyhighlightHeroBannerController = require("../../Controller/Admin/KeyhighlightHeroBanner");
const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/KeyhighlightHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(  "/addkeyhighlightheroBanner",          upload.any(), keyhighlightHeroBannerController.addHeroBanner);
router.get(   "/getkeyhighlightheroBanner",                        keyhighlightHeroBannerController.getHeroBanner);
router.put(   "/editkeyhighlightheroBanner",         upload.any(), keyhighlightHeroBannerController.editHeroBanner);
router.delete("/deletekeyhighlightheroBanner/:Id",                 keyhighlightHeroBannerController.deleteHeroBanner);

module.exports = router;

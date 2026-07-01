const resultHeroBannerController = require("../../Controller/Admin/ResultHeroBanner");
const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/ResultHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(  "/addresultheroBanner",           upload.any(), resultHeroBannerController.addHeroBanner);
router.get(   "/getresultheroBanner",                         resultHeroBannerController.getHeroBanner);
router.put(   "/editresultheroBanner",          upload.any(), resultHeroBannerController.editHeroBanner);
router.delete("/deleteresultheroBanner/:Id",                  resultHeroBannerController.deleteHeroBanner);

module.exports = router;

const contactHeroBannerController = require("../../Controller/Admin/ContactHeroBanner");
const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/ContactHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(  "/addcontactheroBanner",          upload.any(), contactHeroBannerController.addHeroBanner);
router.get(   "/getcontactheroBanner",                        contactHeroBannerController.getHeroBanner);
router.put(   "/editcontactheroBanner",         upload.any(), contactHeroBannerController.editHeroBanner);
router.delete("/deletecontactheroBanner/:Id",                 contactHeroBannerController.deleteHeroBanner);

module.exports = router;

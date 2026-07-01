const eventHeroBannerController = require("../../Controller/Admin/EventHeroBanner");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/EventHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/addeventheroBanner",    upload.any(), eventHeroBannerController.addHeroBanner);
router.get("/geteventheroBanner",     eventHeroBannerController.getHeroBanner);
router.put("/editeventheroBanner",    upload.any(), eventHeroBannerController.editHeroBanner);
router.delete("/deleteeventheroBanner/:Id", eventHeroBannerController.deleteHeroBanner);

module.exports = router;

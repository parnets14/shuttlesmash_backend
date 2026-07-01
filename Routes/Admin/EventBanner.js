const eventbannerController = require("../../Controller/Admin/EventBanner");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/Events"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/eventbanner", upload.any(), eventbannerController.eventbanner);
router.get("/geteventbanner", upload.any(), eventbannerController.geteventbanner);
router.delete("/Deleteeventbanner/:Id", eventbannerController.Deleteeventbanner);
router.put("/editeventbanner", upload.any(), eventbannerController.editeventbanner);

module.exports = router;

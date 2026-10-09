const EventsController = require("../../Controller/Admin/Events");
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

router.post("/events", upload.any(), EventsController.events);
router.get("/getevents", EventsController.getevents);
router.delete("/Deleteevents/:Id", EventsController.Deleteevents);
router.put("/editevents", upload.any(), EventsController.editevents);
router.put("/blockunblock", EventsController.blockevent);
router.put("/resetcategorycount", EventsController.resetCategoryCount);

module.exports = router;

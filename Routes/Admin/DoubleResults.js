const ResultsController = require("../../Controller/Admin/DoubleResults");
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

router.post("/results", upload.any(), ResultsController.results);
router.get("/getresults", upload.any(), ResultsController.getresults);
router.delete("/Deleteresults/:Id", ResultsController.Deleteresults);
router.put("/editresults", upload.any(), ResultsController.editresults);

module.exports = router;

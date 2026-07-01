const SingleresultController = require("../../Controller/Admin/SignleResult");
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

router.post("/add/singleresults", SingleresultController.singleresults);
router.get("/getsingleresults", SingleresultController.getsingleresults);
router.delete("/Deletesresults/:Id", SingleresultController.Deletesresults);
router.put("/editsresults", SingleresultController.editsresults);

module.exports = router;

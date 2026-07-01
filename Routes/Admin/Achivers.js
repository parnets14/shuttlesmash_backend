const achiversController = require("../../Controller/Admin/Achivers");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/Achivers"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/achivers", upload.any(), achiversController.achivers);
router.get("/getachivers", upload.any(), achiversController.getachivers);
router.delete("/Deleteachivers/:Id", achiversController.Deleteachivers);
router.put("/editachivers", upload.any(), achiversController.editachivers);

module.exports = router;

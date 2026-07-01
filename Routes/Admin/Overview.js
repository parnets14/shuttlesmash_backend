const OverviewController = require("../../Controller/Admin/Overview");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/WebManagement"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/overview", upload.any(), OverviewController.overview);
router.get("/getoverview", upload.any(), OverviewController.getoverview);
router.delete("/Deleteoverview/:Id", OverviewController.Deleteoverview);
router.put("/editoverview", upload.any(), OverviewController.editoverview);

module.exports = router;

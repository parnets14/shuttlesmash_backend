const qrcodeController = require("../../Controller/Admin/QR_Code");
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

router.post("/qrcode", upload.any(), qrcodeController.qrcode);
router.get("/getqrcode", upload.any(), qrcodeController.getqrcode);
router.delete("/Deleteqrcode/:Id", qrcodeController.Deleteqrcode);
router.put("/editqrcode", upload.any(), qrcodeController.editqrcode);

module.exports = router;

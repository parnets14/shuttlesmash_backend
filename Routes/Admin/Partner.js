const partnerController = require("../../Controller/Admin/Partner");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/Partners"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/partner", upload.any(), partnerController.partner);
router.get("/getpartner", upload.any(), partnerController.getpartner);
router.delete("/Deletepartner/:Id", partnerController.Deletepartner);
router.put("/editpartner", upload.any(), partnerController.editpartner);

module.exports = router;

const GalleryvedioController = require("../../Controller/Admin/GalleryVedio");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/Gallery"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/galleryvedio", upload.any(), GalleryvedioController.galleryvedio);
router.get("/getgalleryvedio", GalleryvedioController.getgalleryvedio);
router.delete("/Deletegalleryvedio/:Id", GalleryvedioController.Deletegalleryvedio);
router.put("/editgalleryvedio", upload.any(), GalleryvedioController.editgalleryvedio);

module.exports = router;

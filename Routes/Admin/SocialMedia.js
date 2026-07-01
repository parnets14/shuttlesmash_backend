const socialController = require("../../Controller/Admin/SocialMedia");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/SocialMedia"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/social", upload.any(), socialController.social);
router.get("/getsocial", socialController.getsocial);
router.delete("/Deletesocial/:Id", socialController.Deletesocial);
router.put("/editsocial", upload.any(), socialController.editsocial);

module.exports = router;

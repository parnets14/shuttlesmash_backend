const generalController = require("../../Controller/User/GeneralEnquiry");
const express = require("express");
const router = express.Router();
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/SocialMedia");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/general", upload.any(), generalController.general);
router.get("/getgeneral", generalController.getgeneral);
router.delete("/DeleteGeneral/:Id", generalController.DeleteGeneral);
module.exports = router;

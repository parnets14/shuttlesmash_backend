const KeyhighlightController = require("../../Controller/Admin/KeyHighlights");
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

router.post("/keyhighlight", upload.any(), KeyhighlightController.keyhighlight);
router.get("/getkeyhighlight", upload.any(), KeyhighlightController.getkeyhighlight);
router.delete("/Deletekeyhighlight/:Id", KeyhighlightController.Deletekeyhighlight);
router.put("/editkeyhighlight", upload.any(), KeyhighlightController.editkeyhighlight);

module.exports = router;

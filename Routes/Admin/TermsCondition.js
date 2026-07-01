const TermsController = require("../../Controller/Admin/TermsCondition");
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

router.post("/terms", upload.any(), TermsController.terms);
router.get("/getterms", upload.any(), TermsController.getterms);
router.delete("/Deleteterms/:Id", TermsController.Deleteterms);
router.put("/editterms", upload.any(), TermsController.editterms);

module.exports = router;

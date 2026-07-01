const BrochuresController = require("../../Controller/Admin/Brochures");
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

router.post("/brochures", upload.any(), BrochuresController.brochures);
router.get("/getbrochures", upload.any(), BrochuresController.getbrochures);
router.delete("/Deletebrochures/:Id", BrochuresController.Deletebrochures);
router.put("/editbrochures", upload.any(), BrochuresController.editbrochures);

module.exports = router;

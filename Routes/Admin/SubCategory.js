const subcategoryController = require("../../Controller/Admin/SubCategory");
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

router.post("/subcategory", upload.any(), subcategoryController.subcategory);
router.get("/getsubcategory", upload.any(), subcategoryController.getsubcategory);
router.delete("/Deletesubcategory/:Id", subcategoryController.Deletesubcategory);
router.put("/editsubcategory", subcategoryController.editsubcategory);

module.exports = router;

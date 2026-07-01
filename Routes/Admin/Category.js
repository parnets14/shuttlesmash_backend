const categoryController = require("../../Controller/Admin/Category");
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

router.post("/category", categoryController.category);
router.get("/getcategory", categoryController.getcategory);
router.delete("/Deletecategory/:Id", categoryController.Deletecategory);
router.put("/editcategory", categoryController.editcategory);

module.exports = router;

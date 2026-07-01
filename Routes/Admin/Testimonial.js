const TestimonialController = require("../../Controller/Admin/Testimonial");
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

router.post("/testimonial", TestimonialController.testimonial);
router.get("/gettestimonial", TestimonialController.gettestimonial);
router.delete("/Deletetestimonial/:Id", TestimonialController.Deletetestimonial);
router.put("/edittestimonial", TestimonialController.edittestimonial);

module.exports = router;

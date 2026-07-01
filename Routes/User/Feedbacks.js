const FeedbackController = require("../../Controller/User/Feedbacks");
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
router.post("/feedback", FeedbackController.feedback);
router.get("/getfeedback", FeedbackController.getfeedback);
router.delete("/DeleteFeedback/:Id", FeedbackController.DeleteFeedback);
module.exports = router;

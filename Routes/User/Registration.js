const registrationController = require("../../Controller/User/Registration");
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
router.post("/registration", upload.any(), registrationController.registration);
router.get("/getregistration", registrationController.getregistration);
router.delete("/Deleteregistration/:Id", registrationController.Deleteregistration);
router.put("/makeStatusChangebookings",registrationController.makeStatusChangebookings);
router.post("/sendmail", registrationController.sendMail);
router.post("/paymentstatusmail", registrationController.sendMailpaymentstatus);
router.put("/paymentstatus", registrationController.paymentstatus);
module.exports = router;

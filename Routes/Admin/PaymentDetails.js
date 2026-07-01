const PaymentController = require("../../Controller/Admin/PaymentDetails");
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

router.post("/payment", PaymentController.payment);
router.get("/getpayment", PaymentController.getpayment);
router.get("/getbookingById/:id", PaymentController.getbookingById);
router.delete("/Deletepayment/:Id", PaymentController.Deletepayment);
router.put("/editpayment", PaymentController.editpayment);

module.exports = router;

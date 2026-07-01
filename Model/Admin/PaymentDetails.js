const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PaymentSchema = new Schema(
  {
    userId: {
      type: String,
      // ref:"User"
    },

    AccountHolderName: {
      type: String,
    },

    TransactionID: {
      type: String,
    },
    AccountNumber: {
      type: Number,
    },

    PaidAmount: {
      type: Number,
    },
    Remarks: {
      type: String,
    },
  },

  { timestamps: true }
);
const PaymentModel = mongoose.model("PaymentDetails", PaymentSchema);
module.exports = PaymentModel;

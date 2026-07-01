const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TermsSchema = new Schema(
  {
    Eligibility: {
      type: String,
    },
  },
  { timestamps: true }
);
const TermsModal = mongoose.model("Terms&Condition", TermsSchema);
module.exports = TermsModal;

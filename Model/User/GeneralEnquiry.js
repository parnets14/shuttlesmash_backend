const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GeneralSchema = new Schema(
  {
    GUName: {
      type: String,
    },

    GUPhone: {
      type: String,
    },
    GUEmail: {
      type: String,
    },
  
    GUMessage: {
      type: String,
    },

    QueryDate: {
      type: String,
    },

      QueryStatus: {
      type: String,
    },
  },
  { timestamps: true }
);
const GeneralModel = mongoose.model("GeneralEnquiry", GeneralSchema);
module.exports = GeneralModel;

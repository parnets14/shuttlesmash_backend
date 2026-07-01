const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SingleResultsSchema = new Schema(
  {
   
    SResultCategory: {
      type: String,
    },

    SResultSubCategory: {
      type: String,
    },

    SPlayername: {
      type: String,
    },

    SPosition: {
      type: String,
    },

    SCompany: {
      type: String,
    },
  },
  { timestamps: true }
);
const SingleresultModal = mongoose.model("SingleResults", SingleResultsSchema);
module.exports = SingleresultModal;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PartnerSchema = new Schema(
  {
    PartnerImage: {
      type: String,
    },
    PartnerLink: {
      type: String,
    },
  },
  { timestamps: true }
);
const PartnerModel = mongoose.model("Partners", PartnerSchema);
module.exports = PartnerModel;

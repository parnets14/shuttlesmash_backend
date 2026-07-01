const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BrochuresSchema = new Schema(
  {
    Brochure: {
      type: String,
    },
  },
  { timestamps: true }
);
const BrochuresModal = mongoose.model("Brochures", BrochuresSchema);
module.exports = BrochuresModal;

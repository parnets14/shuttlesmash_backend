const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SubcategorySchema = new Schema(
  {
   
    Qrcode: {
      type: String,
    },
 
  },
  { timestamps: true }
);
const SubcategoryModel = mongoose.model("SubCategory", SubcategorySchema);
module.exports = SubcategoryModel;
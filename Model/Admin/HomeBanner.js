const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BannerSchema = new Schema(
  {
    BannerImages: [{ type: String }],  // Array of image/video filenames
    BannerImage: { type: String },      // Keep for backward compatibility
    BannerText: { type: String },
    BannerText2: { type: String },
    BannerText3: { type: String },
    BannerTagline: { type: String },
  },
  { timestamps: true }
);
const BannerModel = mongoose.model("Homebanner", BannerSchema);
module.exports = BannerModel;

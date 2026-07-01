const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let KeyhighlightHeroBannerSchema = new Schema(
  {
    HeroImage:       { type: String },
    HeroTitle:       { type: String },
    HeroDescription: { type: String },
  },
  { timestamps: true }
);

const KeyhighlightHeroBannerModel = mongoose.model("KeyhighlightHeroBanner", KeyhighlightHeroBannerSchema);
module.exports = KeyhighlightHeroBannerModel;

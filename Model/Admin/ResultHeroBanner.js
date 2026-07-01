const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ResultHeroBannerSchema = new Schema(
  {
    HeroImage: { type: String },
    HeroTitle: { type: String },
    HeroDescription: { type: String },
  },
  { timestamps: true }
);

const ResultHeroBannerModel = mongoose.model("ResultHeroBanner", ResultHeroBannerSchema);
module.exports = ResultHeroBannerModel;

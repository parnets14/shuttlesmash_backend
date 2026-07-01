const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let OverviewHeroBannerSchema = new Schema(
  {
    HeroImage:       { type: String },
    HeroTitle:       { type: String },
    HeroDescription: { type: String },
  },
  { timestamps: true }
);

const OverviewHeroBannerModel = mongoose.model("OverviewHeroBanner", OverviewHeroBannerSchema);
module.exports = OverviewHeroBannerModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let LeadershipHeroBannerSchema = new Schema(
  {
    HeroImage:       { type: String },
    HeroTitle:       { type: String },
    HeroDescription: { type: String },
  },
  { timestamps: true }
);

const LeadershipHeroBannerModel = mongoose.model("LeadershipHeroBanner", LeadershipHeroBannerSchema);
module.exports = LeadershipHeroBannerModel;

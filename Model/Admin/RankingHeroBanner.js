const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RankingHeroBannerSchema = new Schema(
  {
    HeroImage: {
      type: String,
    },
    HeroTitle: {
      type: String,
    },
    HeroDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const RankingHeroBannerModel = mongoose.model("RankingHeroBanner", RankingHeroBannerSchema);
module.exports = RankingHeroBannerModel;

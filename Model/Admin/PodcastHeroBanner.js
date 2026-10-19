const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PodcastHeroBannerSchema = new Schema(
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

const PodcastHeroBannerModel = mongoose.model("PodcastHeroBanner", PodcastHeroBannerSchema);
module.exports = PodcastHeroBannerModel;

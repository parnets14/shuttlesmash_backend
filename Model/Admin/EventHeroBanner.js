const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let EventHeroBannerSchema = new Schema(
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

const EventHeroBannerModel = mongoose.model("EventHeroBanner", EventHeroBannerSchema);
module.exports = EventHeroBannerModel;

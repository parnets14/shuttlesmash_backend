const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GalleryHeroBannerSchema = new Schema(
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

const GalleryHeroBannerModel = mongoose.model("GalleryHeroBanner", GalleryHeroBannerSchema);
module.exports = GalleryHeroBannerModel;

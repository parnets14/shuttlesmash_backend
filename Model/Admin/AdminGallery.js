const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GallerySchema = new Schema(
  {
    // GalleryImage: {
    //   type: String,
    // },
    // GalleryText: {
    //   type: String,
    // },
    GalleryTitle: {
      type: String,
    },
    PlaceImages: [
      {
        placepicture: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
const GalleryModel = mongoose.model("Gallery", GallerySchema);
module.exports = GalleryModel;

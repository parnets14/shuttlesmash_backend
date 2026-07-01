const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GalleryvedioSchema = new Schema(
  {
    GalleryVedioTitle: {
      type: String,
    },
    GalleryVedio: {
      type: String,
    },
  },
  { timestamps: true }
);
const GalleryvedioModel = mongoose.model("GalleryVedio", GalleryvedioSchema);
module.exports = GalleryvedioModel;

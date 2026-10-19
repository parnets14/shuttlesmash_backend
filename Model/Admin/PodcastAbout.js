const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PodcastAboutSchema = new Schema(
  {
    AboutImage: {
      type: String,
    },
    AboutTitle: {
      type: String,
    },
    AboutDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const PodcastAboutModel = mongoose.model("PodcastAbout", PodcastAboutSchema);
module.exports = PodcastAboutModel;

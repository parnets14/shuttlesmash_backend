const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PodcastSchema = new Schema(
  {
    PodcastTitle: {
      type: String,
    },
    PodcastGuest: {
      type: String,
    },
    PodcastDescription: {
      type: String,
    },
    PodcastLink: {
      type: String,
    },
  },
  { timestamps: true }
);
const PodcastModel = mongoose.model("Podcast", PodcastSchema);
module.exports = PodcastModel;

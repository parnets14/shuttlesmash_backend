const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let EventbannerSchema = new Schema(
  {
    EventbannerImage: {
      type: String,
    },
    EventbannerTitle: {
      type: String,
    },
  },
  { timestamps: true }
);
const EventbannerModel = mongoose.model("Eventbanner", EventbannerSchema);
module.exports = EventbannerModel;

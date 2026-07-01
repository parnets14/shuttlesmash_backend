const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AchiversSchema = new Schema(
  {
    AchiversImage: {
      type: String,
    },
    AchiversText: {
      type: String,
    },
  },
  { timestamps: true }
);
const AchiversModel = mongoose.model("Achivers", AchiversSchema);
module.exports = AchiversModel;

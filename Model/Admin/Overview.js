const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let OverviewSchema = new Schema(
  {
    OverviewImage: { type: String },
    OverviewTitle: { type: String },
    OverviewDesc:  { type: String },
  },
  { timestamps: true }
);
const OverviewModal = mongoose.model("Overview", OverviewSchema);
module.exports = OverviewModal;

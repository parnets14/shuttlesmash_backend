const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let KeyhighlightSchema = new Schema(
  {
    KeyhighlightImage: { type: String },
    KeyhighlightTitle: { type: String },
    KeyhighlightDesc:  { type: String },
  },
  { timestamps: true }
);
const KeyhighlightModal = mongoose.model("Keyhighlights", KeyhighlightSchema);
module.exports = KeyhighlightModal;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let QrcodeSchema = new Schema(
  {
    QrcodeImage: {
      type: String,
    },

  },
  { timestamps: true }
);
const QrcodeModel = mongoose.model("QRCode", QrcodeSchema);
module.exports = QrcodeModel;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FeedbackSchema = new Schema(
  {
    UserName: {
      type: String,
    },

    UserPhoneNumber: {
      type: String,
    },
    UserLocation: {
      type: String,
    },

    FeedbackMessage: {
      type: String,
    },

    FeedbackStatus: {
      type: String,
    },

    FeedbackDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const FeedbackModel = mongoose.model("Feedbacks", FeedbackSchema);
module.exports = FeedbackModel;

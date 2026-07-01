const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const RegistrationSchema = new Schema({
  eventsId: {
    type: ObjectId,
    ref: "Events",
  },

  EventNames: {
    type: String,
  },

  EventsDate: {
    type: String,
  },

  playerNames: {},
  PlayerEmail: {
    type: String,
  },
  PlayerPhoneNo: {
    type: String,
  },
  TotalAmount: {
    type: Number,
  },
  status: {
    type: String,
    default: "Pending",
  },

  RegisteredDate: {
    type: String,
    required: true,
  },
  
  RegisteredTime: {
    type: String,
    required: true,
  },

  Category: [
    {
      categoryId: {
        type: ObjectId,
        ref: "Category",
      },
    },
  ],
});

const RegistrationModel = mongoose.model(
  "RegistrationList",
  RegistrationSchema
);
module.exports = RegistrationModel;

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
  // Team registrations: the organisation the team is playing for
  OrganisationName: {
    type: String,
    default: "",
  },
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

  PaymentDate: {
    type: String,
    default: "",
  },

  Category: [
    {
      categoryId: {
        type: ObjectId,
        ref: "Category",
      },
    },
  ],

  catForms: [],

  // Flat copies used to enforce "one phone / one email per event"
  PlayerEmails: { type: [String], default: [] },
  PlayerPhones: { type: [String], default: [] },
});

const RegistrationModel = mongoose.model(
  "RegistrationList",
  RegistrationSchema
);
module.exports = RegistrationModel;

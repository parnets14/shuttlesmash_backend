const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ResultsSchema = new Schema(
  {
   
    TournamentName: {
      type: String,
    },

    TournamentDate: {
      type: String,
    },

    ResultCategory: {
      type: String,
    },

    ResultSubCategory: {
      type: String,
    },

    FirstPlayername: {
      type: String,
    },

    SecondPlayername: {
      type: String,
    },

    Position: {
      type: String,
    },

    Company: {
      type: String,
    },
  },
  { timestamps: true }
);
const ResultsModal = mongoose.model("DoubleResults", ResultsSchema);
module.exports = ResultsModal;

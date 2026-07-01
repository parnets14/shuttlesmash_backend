const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CategorySchema = new Schema(
  {
    CategoryName: {
      type: String,
    },
    CategoryPrice: {
      type: Number,
    },
    TotalPlayers: {
      type: Number,
    },
    CategoryType: {
      type: String,
    },
    CategoryDesc: {
      type: String,
    },
  },

  { timestamps: true }
);
const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;

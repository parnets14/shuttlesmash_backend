const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TestimonialSchema = new Schema(
  {
    Name: {
      type: String,
    },

    Designation: {
      type: String,
    },

    Description: {
      type: String,
    },
  },
  { timestamps: true }
);
const TestimonialModal = mongoose.model("Testimonials", TestimonialSchema);
module.exports = TestimonialModal;

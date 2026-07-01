const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let EventInfoSchema = new Schema(
  {
    Venue:              { type: String },
    OrganizerName:      { type: String },
    OrganizerEmail:     { type: String },
    // Tournament Overview structured fields
    OvTitle:            { type: String },   // e.g. "Q2:1st/3 Junior Ranking Tournament"
    OvSubtitle:         { type: String },   // e.g. "First Ranking Tournament of the Quarter 2 out of 3"
    OvInitiative:       { type: String },   // e.g. "Initiative by ..."
    OvStatus:           { type: String, enum: ["Upcoming", "Present", "Completed", ""], default: "" }, // tournament status
    OvSections: [
      {
        sectionTitle: { type: String },     // e.g. "PERKS", "SCHEDULE: Boys", "" (no title = plain list)
        points:       [{ type: String }],   // each bullet point
      }
    ],
    OvEntryFee:         { type: String },   // e.g. "₹ 899 for Singles"
    OvEntryFeeNote:     { type: String },   // e.g. "Complimentary Jerseys for first 30..."
    OvYouTubeLink:      { type: String },   // YouTube URL
  },
  { timestamps: true }
);

const EventInfoModal = mongoose.model("EventInfo", EventInfoSchema);
module.exports = EventInfoModal;

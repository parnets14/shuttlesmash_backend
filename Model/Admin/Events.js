const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Category sub-schema (embedded in each event)
const CategorySubSchema = new Schema({
  CategoryName:    { type: String },
  CategoryPrice:   { type: Number },
  TotalPlayers:    { type: Number },
  CategoryType:    { type: String },
  Limit:           { type: Number, default: 0 },  // 0 = unlimited
  RegisteredCount: { type: Number, default: 0 },
}, { _id: true });

// Event Info sub-schema (embedded in each event)
const EventInfoSubSchema = new Schema({
  Venue:          { type: String },
  OrganizerName:  { type: String },
  OrganizerEmail: { type: String },
  OvTitle:        { type: String },
  OvSubtitle:     { type: String },
  OvInitiative:   { type: String },
  OvStatus:       { type: String, default: "" },
  OvSections:     [{
    sectionTitle: { type: String },
    points:       [{ type: String }],
  }],
  OvEntryFee:     { type: String },
  OvEntryFeeNote: { type: String },
  OvYouTubeLink:  { type: String },
}, { _id: false });

let EventsSchema = new Schema(
  {
    EventImage:     { type: String },
    EventName:      { type: String },
    EventStartdate: { type: String },
    EventEnddate:   { type: String },
    EventLocation:  { type: String },
    EventExhibits:  { type: String },
    Time:           { type: String },
    Status:         { type: String },
    isBlock:        { type: Boolean, default: false },

    // Embedded categories for this event
    Categories: [CategorySubSchema],

    // Embedded event info for this event
    EventInfo: EventInfoSubSchema,

    // Brochure file for this event
    Brochure: { type: String },
  },
  { timestamps: true }
);

const EventsModal = mongoose.model("Events", EventsSchema);
module.exports = EventsModal;

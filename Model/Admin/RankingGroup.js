const mongoose = require("mongoose");

const RankingGroupSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true, // e.g. "2025 - CORPORATE RANKING"
    },
    Tagline: {
      type: String,
      default: "",
    },
    GroupImage: {
      type: String, // uploaded photo shown on the card
    },
    Year: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      required: true, // e.g. "Men's Singles", "Corporate"
    },
    /* the events shown as tabs on the leaderboard page,
       e.g. ["Men's Singles","Int Men's Doubles","Women's Doubles"] */
    Categories: {
      type: [String],
      default: [],
    },
    /* the bonus scoring columns, fully editable from the admin panel.
       The public header is rendered as "<points> for <label>",
       e.g. { label:"Semi Finalists", points:5 } -> "5 for Semi Finalists" */
    BonusColumns: {
      type: [
        {
          _id: false,
          key:    { type: String },
          label:  { type: String },
          points: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    SortOrder: {
      type: Number,
      default: 0,
    },
    TournamentLabels: {
      type: [String],
      default: [],  // e.g. ["Jan Open", "Feb Open", "Mar Open"]
    },
    Status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rankinggroup", RankingGroupSchema);

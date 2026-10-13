const mongoose = require("mongoose");

const RankingSchema = new mongoose.Schema(
  {
    /* ── which card / group this player belongs to ── */
    GroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rankinggroup",
      index: true,
    },

    /* ── basic info ── */
    Rank: {
      type: Number,
      required: true, // = FINAL RANK (auto calculated from Total Spree)
    },
    PlayerName: {
      type: String,
      required: true,
    },
    PlayerImage: {
      type: String,
    },

    /* ── the event this player competes in (e.g. "Men's Singles") ── */
    Category: {
      type: String,
      required: true,
    },
    Year: {
      type: Number,
      required: true,
    },

    /* ── scoring ──
       Total Points Scored .......... base points collected across tournaments
       5 for Semi Finalists ......... points earned from semi-final finishes
       10 for RunnersUp ............. points earned from runner-up finishes
       20 for Winner ................ points earned from title wins
       Total Spree .................. (base + semi + runner + winner) / 10
    */
    TotalPointsScored: {
      type: Number,
      default: 0,
    },
    SemiFinalistPoints: {
      type: Number,
      default: 0,
    },
    RunnersUpPoints: {
      type: Number,
      default: 0,
    },
    WinnerPoints: {
      type: Number,
      default: 0,
    },
    TotalSpree: {
      type: Number,
      default: 0,
    },

    /* bonus points per player — one entry per column defined on the ranking group.
       Total Spree = (TotalPointsScored + sum of every Bonus.value) / 10 */
    Bonus: {
      type: [
        {
          _id: false,
          key:   { type: String },
          value: { type: Number, default: 0 },
        },
      ],
      default: [],
    },

    /* Points kept as an alias of TotalSpree so older screens keep working */
    Points: {
      type: Number,
      default: 0,
    },

    /* ── optional profile extras ── */
    State: { type: String },
    City: { type: String },
    Club: { type: String },
    PreviousRank: { type: Number, default: 0 },
    TournamentsPlayed: { type: Number, default: 0 },
    tournamentPoints: { type: [Number], default: [] },

    Status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const RankingModel = mongoose.model("ranking", RankingSchema);
module.exports = RankingModel;

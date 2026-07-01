const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let LeadershipTeamSchema = new Schema(
  {
    MemberImage: { type: String },
    MemberName:  { type: String },
    MemberRole:  { type: String },
    MemberDesc:  { type: String },
    MemberInsta: { type: String },
  },
  { timestamps: true }
);

const LeadershipTeamModel = mongoose.model("LeadershipTeam", LeadershipTeamSchema);
module.exports = LeadershipTeamModel;

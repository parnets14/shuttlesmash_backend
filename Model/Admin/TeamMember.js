const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TeamMemberSchema = new Schema(
  {
    MemberImage: { type: String },
    MemberName:  { type: String },
    MemberRole:  { type: String },
    MemberDesc:  { type: String },
    MemberInsta: { type: String },
  },
  { timestamps: true }
);

const TeamMemberModel = mongoose.model("TeamMembers", TeamMemberSchema);
module.exports = TeamMemberModel;

const LeadershipTeamModel = require("../../Model/Admin/LeadershipTeam");

class LeadershipTeam {
  // POST — add
  async addMember(req, res) {
    try {
      const { MemberName, MemberRole, MemberDesc, MemberInsta } = req.body;
      const file = req.files?.[0]?.filename;

      if (!MemberName) return res.status(400).json({ msg: "Name is required" });
      if (!MemberRole) return res.status(400).json({ msg: "Role is required" });

      const newMember = new LeadershipTeamModel({
        MemberImage: file || "",
        MemberName,
        MemberRole,
        MemberDesc,
        MemberInsta: MemberInsta || "",
      });

      await newMember.save();
      return res.status(200).json({ success: "Leadership Member Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot add member" });
    }
  }

  // GET — all
  async getMembers(req, res) {
    try {
      const members = await LeadershipTeamModel.find({}).sort({ createdAt: 1 });
      return res.status(200).json({ getleadershipteam: members });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot fetch members" });
    }
  }

  // DELETE
  async deleteMember(req, res) {
    try {
      await LeadershipTeamModel.deleteOne({ _id: req.params.Id });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot delete" });
    }
  }

  // PUT — edit
  async editMember(req, res) {
    try {
      const { id, MemberName, MemberRole, MemberDesc, MemberInsta } = req.body;
      const file = req.files?.[0]?.filename;
      const obj = {};

      if (file)                         obj["MemberImage"] = file;
      if (MemberName)                   obj["MemberName"]  = MemberName;
      if (MemberRole)                   obj["MemberRole"]  = MemberRole;
      if (MemberDesc !== undefined)     obj["MemberDesc"]  = MemberDesc;
      obj["MemberInsta"] = MemberInsta || "";

      const data = await LeadershipTeamModel.findByIdAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Member not found" });
      return res.status(200).json({ success: "Updated Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot update" });
    }
  }
}

const leadershipTeamController = new LeadershipTeam();
module.exports = leadershipTeamController;

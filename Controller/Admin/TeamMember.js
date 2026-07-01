const TeamMemberModel = require("../../Model/Admin/TeamMember");

class TeamMember {
  // POST — add
  async addTeamMember(req, res) {
    try {
      const { MemberName, MemberRole, MemberDesc, MemberInsta } = req.body;
      const file = req.files?.[0]?.filename;

      if (!MemberName) return res.status(400).json({ msg: "Name is required" });
      if (!MemberRole) return res.status(400).json({ msg: "Role is required" });

      const newMember = new TeamMemberModel({
        MemberImage: file || "",
        MemberName,
        MemberRole,
        MemberDesc,
        MemberInsta: MemberInsta || "",
      });

      await newMember.save();
      return res.status(200).json({ success: "Team Member Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot add team member" });
    }
  }

  // GET — all
  async getTeamMembers(req, res) {
    try {
      const members = await TeamMemberModel.find({}).sort({ createdAt: 1 });
      return res.status(200).json({ getteammembers: members });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot fetch team members" });
    }
  }

  // DELETE
  async deleteTeamMember(req, res) {
    try {
      await TeamMemberModel.deleteOne({ _id: req.params.Id });
      return res.status(200).json({ success: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Cannot delete" });
    }
  }

  // PUT — edit
  async editTeamMember(req, res) {
    try {
      const { id, MemberName, MemberRole, MemberDesc, MemberInsta } = req.body;
      const file = req.files?.[0]?.filename;
      const obj = {};

      if (file)                          obj["MemberImage"] = file;
      if (MemberName)                    obj["MemberName"]  = MemberName;
      if (MemberRole)                    obj["MemberRole"]  = MemberRole;
      if (MemberDesc  !== undefined)     obj["MemberDesc"]  = MemberDesc;
      obj["MemberInsta"] = MemberInsta || "";

      const data = await TeamMemberModel.findByIdAndUpdate(
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

const teamMemberController = new TeamMember();
module.exports = teamMemberController;

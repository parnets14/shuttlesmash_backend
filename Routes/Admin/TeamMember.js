const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const teamMemberController = require("../../Controller/Admin/TeamMember");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/TeamMembers"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/addteammember",    upload.any(), teamMemberController.addTeamMember);
router.get("/getteammembers",    teamMemberController.getTeamMembers);
router.delete("/deleteteammember/:Id", teamMemberController.deleteTeamMember);
router.put("/editteammember",    upload.any(), teamMemberController.editTeamMember);

module.exports = router;

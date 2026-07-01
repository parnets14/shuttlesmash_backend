const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const leadershipTeamController = require("../../Controller/Admin/LeadershipTeam");

const uploadPath = path.join(__dirname, "../../Public/LeadershipTeam");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/addleadershipmember",       upload.any(), leadershipTeamController.addMember);
router.get("/getleadershipteam",                        leadershipTeamController.getMembers);
router.delete("/deleteleadershipmember/:Id",            leadershipTeamController.deleteMember);
router.put("/editleadershipmember",       upload.any(), leadershipTeamController.editMember);

module.exports = router;

const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");
const ctrl    = require("../../Controller/Admin/RankingGroup");

const UPLOAD_DIR = path.join(__dirname, "../../Public/Rankings");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

router.post(  "/rankinggroup",            upload.single("GroupImage"), ctrl.addGroup);
router.get(   "/getrankinggroups",                                     ctrl.getGroups);
router.get(   "/activerankinggroups",                                  ctrl.getActiveGroups);
router.put(   "/editrankinggroup",        upload.single("GroupImage"), ctrl.editGroup);
router.delete("/deleterankinggroup/:id",                               ctrl.deleteGroup);

module.exports = router;

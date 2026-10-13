const rankingHeroBannerController = require("../../Controller/Admin/RankingHeroBanner");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Public/RankingHeroBanner"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/addrankingheroBanner",    upload.any(), rankingHeroBannerController.addHeroBanner);
router.get("/getrankingheroBanner",     rankingHeroBannerController.getHeroBanner);
router.put("/editrankingheroBanner",    upload.any(), rankingHeroBannerController.editHeroBanner);
router.delete("/deleterankingheroBanner/:Id", rankingHeroBannerController.deleteHeroBanner);

module.exports = router;

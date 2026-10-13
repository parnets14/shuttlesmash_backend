const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const RankingController = require("../../Controller/Admin/Ranking");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../Public/Rankings");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/ranking", upload.single("PlayerImage"), RankingController.addRanking);
router.post("/ranking/bulk", RankingController.bulkUploadRankings);
router.get("/getrankings", RankingController.getRankings);
router.get("/getrankings/year/:year", RankingController.getRankingsByYear);
// NOTE: must be declared before "/getrankings/:category/:year"
router.get("/getrankings/group/:groupId", RankingController.getRankingsByGroup);
router.get("/getrankings/:category/:year", RankingController.getRankingsByCategoryYear);
router.get("/ranking/years", RankingController.getDistinctYears);
router.get("/ranking/categories", RankingController.getDistinctCategories);
router.put("/editranking", upload.single("PlayerImage"), RankingController.editRanking);
router.delete("/deleteranking/:id", RankingController.deleteRanking);
router.get("/activerankings", RankingController.getActiveRankings);

module.exports = router;

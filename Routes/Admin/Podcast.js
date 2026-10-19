const PodcastController = require("../../Controller/Admin/Podcast");
const express = require("express");
const router = express.Router();

// Podcast stores a YouTube link (String) only — no file upload required.
router.post("/podcast", PodcastController.podcast);
router.get("/getpodcast", PodcastController.getpodcast);
router.delete("/Deletepodcast/:Id", PodcastController.Deletepodcast);
router.put("/editpodcast", PodcastController.editpodcast);

module.exports = router;

const EventInfoController = require("../../Controller/Admin/EventInfo");
const express = require("express");
const router = express.Router();
const multer = require("multer");

// No file uploads needed for this feature — use memoryStorage as placeholder
const upload = multer();

router.post("/addeventinfo",          upload.none(), EventInfoController.addeventinfo);
router.get("/geteventinfo",                          EventInfoController.geteventinfo);
router.put("/editeventinfo",          upload.none(), EventInfoController.editeventinfo);
router.delete("/deleteeventinfo/:Id",                EventInfoController.deleteeventinfo);

module.exports = router;

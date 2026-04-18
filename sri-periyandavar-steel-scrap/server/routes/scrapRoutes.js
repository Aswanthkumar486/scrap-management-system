const express = require("express");
const router = express.Router();

const {
  getScrap,
  updateScrap,
  createScrap
} = require("../controllers/scrapController");

router.get("/", getScrap);
router.post("/", createScrap);   // ✅ ADD THIS
router.put("/:id", updateScrap);

module.exports = router;
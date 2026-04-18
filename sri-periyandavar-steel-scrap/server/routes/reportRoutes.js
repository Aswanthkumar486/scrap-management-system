const express = require("express");
const router = express.Router();

const {
  getSalesReport,
  getPurchaseReport,
  getSalesByDate,
  getSummary
} = require("../controllers/reportController");

const auth = require("../middleware/authMiddleware");

// ✅ ROUTES
router.get("/sales", auth, getSalesReport);
router.get("/purchase", auth, getPurchaseReport);

// 🔥 DATE FILTER
router.get("/sales-by-date", auth, getSalesByDate);

// 🔥 SUMMARY
router.get("/summary", auth, getSummary);

module.exports = router;
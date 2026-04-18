const express = require("express");
const router = express.Router();

const {
  addSale,
  getSales,
  filterSales
} = require("../controllers/salesController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, addSale);
router.get("/", auth, getSales);
router.get("/filter", auth, filterSales);

module.exports = router;
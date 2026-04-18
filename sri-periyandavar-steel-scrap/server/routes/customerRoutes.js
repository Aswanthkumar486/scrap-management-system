const express = require("express");
const Purchase = require("../models/Purchase");
const Sale = require("../models/Sale");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const purchases = await Purchase.find();
  const sales = await Sale.find();

  const customers = [
    ...purchases.map(p => p.customerName),
    ...sales.map(s => s.customerName)
  ];

  res.json([...new Set(customers)]);
});

module.exports = router;
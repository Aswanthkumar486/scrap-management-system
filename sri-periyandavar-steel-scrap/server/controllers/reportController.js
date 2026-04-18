const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");

// ✅ SALES REPORT (ALL)
exports.getSalesReport = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PURCHASE REPORT (ALL)
exports.getPurchaseReport = async (req, res) => {
  try {
    const purchase = await Purchase.find();
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DATE WISE SALES REPORT 🔥
exports.getSalesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const data = await Sale.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ TOTAL SUMMARY (DASHBOARD)
exports.getSummary = async (req, res) => {
  try {
    const totalSales = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const totalPurchase = await Purchase.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    res.json({
      sales: totalSales[0]?.total || 0,
      purchase: totalPurchase[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// ✅ ADD SALE
exports.addSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();

    // reduce stock
    let product = await Product.findOne({ name: req.body.product });

    if (product) {
      product.stock -= Number(req.body.weight);
      await product.save();
    }

    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.filterSales = async (req, res) => {
  try {
    const { from, to } = req.query;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // include full day end time
    toDate.setHours(23, 59, 59, 999);

    const data = await Sale.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ GET SALES
exports.getSales = async (req, res) => {
  const data = await Sale.find();
  res.json(data);
};
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// ✅ ADD SALE
exports.addSale = async (req, res) => {
  try {
    const { customerName, items, total } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // ✅ Create Sale
    const sale = new Sale({
      customerName,
      items,
      total
    });

    await sale.save();

    // ✅ Reduce stock for each product
    for (let item of items) {
      let product = await Product.findOne({ name: item.product });

      if (product) {
        product.stock -= Number(item.weight);

        // ❗ Prevent negative stock
        if (product.stock < 0) product.stock = 0;

        await product.save();
      }
    }

    res.json(sale);

  } catch (err) {
    console.log("Add sale error:", err);
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
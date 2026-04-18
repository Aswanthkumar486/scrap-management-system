const Product = require("../models/Product");

// ✅ ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { name, pricePerKg, stock } = req.body;

    // ✅ VALIDATION
    if (!name || !pricePerKg || !stock) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const product = new Product({
      name,
      pricePerKg: Number(pricePerKg),
      stock: Number(stock)
    });

    const saved = await product.save();

    console.log("SAVED PRODUCT:", saved);

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
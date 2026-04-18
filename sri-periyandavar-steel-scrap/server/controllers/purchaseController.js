const Purchase = require("../models/Purchase");
const Inventory = require("../models/Inventory");

exports.addPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();

    let item = await Inventory.findOne({ material: req.body.material });

    if (item) {
      item.quantity += Number(req.body.weight);
    } else {
      item = new Inventory({
        material: req.body.material,
        quantity: req.body.weight
      });
    }

    await item.save();

    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchase = async (req, res) => {
  const data = await Purchase.find();
  res.json(data);
};
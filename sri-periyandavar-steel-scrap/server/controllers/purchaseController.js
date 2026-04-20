const Purchase = require("../models/Purchase");
const Inventory = require("../models/Inventory");

exports.addPurchase = async (req, res) => {
  try {
    const { customerName, items, total, image } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // ✅ Save purchase
    const purchase = new Purchase({
      customerName,
      items,
      total,
      image
    });

    await purchase.save();

    // ✅ Update inventory for each item
    for (let itemData of items) {
      let item = await Inventory.findOne({ material: itemData.material });

      if (item) {
        item.quantity += Number(itemData.weight);
      } else {
        item = new Inventory({
          material: itemData.material,
          quantity: itemData.weight
        });
      }

      await item.save();
    }

    res.json(purchase);

  } catch (err) {
    console.log("Purchase error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchase = async (req, res) => {
  const data = await Purchase.find();
  res.json(data);
};
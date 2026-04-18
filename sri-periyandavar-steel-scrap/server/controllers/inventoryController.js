const Inventory = require("../models/Inventory");

// ✅ GET INVENTORY
exports.getInventory = async (req, res) => {
  try {
    const data = await Inventory.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE INVENTORY (MANUAL EDIT)
exports.updateInventory = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE INVENTORY
exports.deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
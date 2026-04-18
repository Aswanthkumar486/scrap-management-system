const Scrap = require("../models/Scrap");

// ✅ GET all scrap data
const getScrap = async (req, res) => {
  try {
    const scrapData = await Scrap.find();
    res.status(200).json(scrapData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE scrap
const createScrap = async (req, res) => {
  try {
    const data = req.body;

    // If array → bulk insert
    if (Array.isArray(data)) {
      const result = await Scrap.insertMany(data);
      return res.status(201).json(result);
    }

    // If single object → normal insert
    const scrap = new Scrap(data);
    await scrap.save();

    res.status(201).json(scrap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE scrap price by ID
const updateScrap = async (req, res) => {
  try {
    const { id } = req.params;
    const { pricePerKg } = req.body;

    const updated = await Scrap.findByIdAndUpdate(
      id,
      {
        pricePerKg,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Scrap not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE scrap
const deleteScrap = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Scrap.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Scrap not found" });
    }

    res.status(200).json({ message: "Scrap deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getScrap,
  createScrap,
  updateScrap,
  deleteScrap,
};
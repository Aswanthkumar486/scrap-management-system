const mongoose = require("mongoose");

const scrapSchema = new mongoose.Schema({
  material: {
    type: String,
    required: true,
    trim: true,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Scrap", scrapSchema);
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  customerName: String,
  material: String,
  weight: Number,
  pricePerKg: Number,
  total: Number,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Purchase", schema);
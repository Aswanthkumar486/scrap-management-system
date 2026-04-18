const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  material: String,
  quantity: Number
});

module.exports = mongoose.model("Inventory", schema);
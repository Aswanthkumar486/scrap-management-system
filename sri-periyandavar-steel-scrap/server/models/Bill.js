const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  material: String,
  weight: Number,
  pricePerKg: Number,
  total: Number
});

const billSchema = new mongoose.Schema({
  invoiceNo: String,
  customerName: String,
  items: [itemSchema],
  subTotal: Number,
  gst: Number,
  gstAmount: Number,
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bill", billSchema);
const mongoose = require("mongoose");

// const saleSchema = new mongoose.Schema({
//   customerName: String,
//   product: String,
//   weight: Number,
//   pricePerKg: Number,
//   total: Number
// }, { timestamps: true }); // 🔥 IMPORTANT

// module.exports = mongoose.model("Sale", saleSchema);
// const mongoose = require("mongoose");

// const schema = new mongoose.Schema({
//   customerName: String,
//   product: String,
//   weight: Number,
//   pricePerKg: Number,
//   total: Number
// }, { timestamps: true });

// module.exports = mongoose.model("Sale", schema);
// const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    customerName: String,

    items: [
      {
        product: String,
        weight: Number,
        pricePerKg: Number,
        total: Number
      }
    ],

    total: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", Schema);
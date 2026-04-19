const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB
mongoose.connect(
  "mongodb+srv://kumaraswanth486_db_user:Ash12345@cluster0.p0hhxl8.mongodb.net/scrapDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

// ✅ Routes
app.use("/api/bill", require("./routes/billRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));
app.use("/api/purchase", require("./routes/purchaseRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/scrap", require("./routes/scrapRoutes"));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(5000, () => console.log("Server running on 5000"));
// const express = require("express");
// const router = express.Router();

// const { addProduct, getProducts } = require("../controllers/productController");
// const auth = require("../middleware/authMiddleware");

// // ADD (protected)
// router.post("/", auth, addProduct);

// // GET (❌ REMOVE auth for dropdown + UI)
// router.get("/", getProducts);

// module.exports = router;


const express = require("express");
const router = express.Router();

const { addProduct, getProducts } = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, addProduct);

// 🔥 REMOVE auth for frontend fetch
router.get("/", getProducts);

module.exports = router;
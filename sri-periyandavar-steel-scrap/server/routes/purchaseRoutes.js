// const express = require("express");
// const router = express.Router();

// const { addPurchase, getPurchase } = require("../controllers/purchaseController");
// const auth = require("../middleware/authMiddleware");

// router.post("/", auth, addPurchase);
// router.get("/", auth, getPurchase);

// module.exports = router;
const express = require("express");
const router = express.Router();

const { addPurchase, getPurchase } = require("../controllers/purchaseController");
const auth = require("../middleware/authMiddleware");

// ✅ CORRECT
router.post("/", auth, addPurchase);
router.get("/", auth, getPurchase);

module.exports = router;
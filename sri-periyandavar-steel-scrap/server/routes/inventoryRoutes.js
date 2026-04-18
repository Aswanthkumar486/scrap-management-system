const express = require("express");
const router = express.Router();

const {
  getInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/inventoryController");

const auth = require("../middleware/authMiddleware");

// ✅ ROUTES
router.get("/", auth, getInventory);
router.put("/:id", auth, updateInventory);
router.delete("/:id", auth, deleteInventory);

module.exports = router;
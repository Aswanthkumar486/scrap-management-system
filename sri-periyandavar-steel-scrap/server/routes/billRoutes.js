const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const auth = require("../middleware/authMiddleware");

const Sale = require("../models/Sale");

// ✅ Generate Bill PDF (MULTIPLE PRODUCTS)
router.get("/:id", auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const gstRate = 0.18;
    const gstAmount = sale.total * gstRate;
    const grandTotal = sale.total + gstAmount;

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=bill-${sale._id}.pdf`
    );

    doc.pipe(res);

    // 🧾 HEADER
    doc.fontSize(18).text("Sri Periyandavar Steel Scrap", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("GST Invoice", { align: "center" });
    doc.moveDown(2);

    // 👤 CUSTOMER
    doc.fontSize(12).text(`Customer: ${sale.customerName}`);
    doc.text(`Date: ${new Date(sale.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // 📦 TABLE HEADER
    doc.fontSize(12).text("Product", 50, doc.y, { continued: true });
    doc.text("Weight", 200, doc.y, { continued: true });
    doc.text("Price/kg", 300, doc.y, { continued: true });
    doc.text("Total", 420, doc.y);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // 📦 MULTIPLE ITEMS LOOP
    sale.items.forEach((item) => {
      doc.moveDown(0.5);
      doc.text(item.product, 50, doc.y, { continued: true });
      doc.text(`${item.weight} kg`, 200, doc.y, { continued: true });
      doc.text(`₹${item.pricePerKg}`, 300, doc.y, { continued: true });
      doc.text(`₹${item.total}`, 420, doc.y);
    });

    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.moveDown(1.5);

    // 💰 TOTALS
    doc.text(`Subtotal: ₹${sale.total.toFixed(2)}`, { align: "right" });
    doc.text(`GST (18%): ₹${gstAmount.toFixed(2)}`, { align: "right" });
    doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, { align: "right" });

    doc.moveDown(3);
    doc.text("Thank you for your business!", { align: "center" });

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error generating bill" });
  }
});

module.exports = router;
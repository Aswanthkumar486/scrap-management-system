const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const auth = require("../middleware/authMiddleware"); // ✅ FIXED

const Sale = require("../models/Sale"); // make sure model exists

// Generate Bill PDF
router.get("/:id", auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // GST Calculation (18%)
    const gstRate = 0.18;
    const gstAmount = sale.total * gstRate;
    const grandTotal = sale.total + gstAmount;

    // Create PDF
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=bill-${sale._id}.pdf`
    );

    doc.pipe(res);

    // HEADER
    doc.fontSize(20).text("Sri Periyandavar Steel Scrap", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("GST Invoice", { align: "center" });
    doc.moveDown(2);

    // CUSTOMER DETAILS
    doc.fontSize(12).text(`Customer: ${sale.customerName}`);
    doc.text(`Product: ${sale.product}`);
    doc.text(`Weight: ${sale.weight} kg`);
    doc.text(`Price per kg: ₹${sale.pricePerKg}`);
    doc.moveDown();

    // CALCULATIONS
    doc.text(`Subtotal: ₹${sale.total.toFixed(2)}`);
    doc.text(`GST (18%): ₹${gstAmount.toFixed(2)}`);
    doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`);

    doc.moveDown(2);
    doc.text(`Date: ${new Date(sale.createdAt).toLocaleDateString()}`);

    doc.moveDown(3);
    doc.text("Thank you for your business!", { align: "center" });

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error generating bill" });
  }
});

module.exports = router;
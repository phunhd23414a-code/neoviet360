const express = require("express");
const router = express.Router();
const authGuard = require("../middleware/authGuard");
const {
  getTopups, createTopup,
  getEwalletTransactions, createEwalletTransaction,
  getQrPayTransactions, createQrPayTransaction,
  getScheduledPayments, createScheduledPayment, updateScheduledPayment, deleteScheduledPayment, toggleScheduledPayment,
  payBill, settleSplitBill
} = require("../controllers/payment.controller");

// Áp dụng authGuard cho tất cả routes
router.use(authGuard);

// Topup
router.get("/topups", getTopups);
router.post("/topups", createTopup);

// E-wallet
router.get("/ewallet", getEwalletTransactions);
router.post("/ewallet", createEwalletTransaction);

// QR Pay
router.get("/qrpay", getQrPayTransactions);
router.post("/qrpay", createQrPayTransaction);

// Scheduled Payments
router.get("/scheduled", getScheduledPayments);
router.post("/scheduled", createScheduledPayment);
router.put("/scheduled/:id", updateScheduledPayment);
router.delete("/scheduled/:id", deleteScheduledPayment);
router.patch("/scheduled/:id/toggle", toggleScheduledPayment);

// Bill Pay
router.post("/bill/pay", payBill);

// Split Bill Settle
router.post("/split-bill/settle", settleSplitBill);

module.exports = router;
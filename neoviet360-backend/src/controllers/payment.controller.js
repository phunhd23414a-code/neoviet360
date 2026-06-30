const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

// ==================== TOPUP ====================
const getTopups = asyncHandler(async (req, res) => {
  const topups = await prisma.topup.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json(topups);
});

const createTopup = asyncHandler(async (req, res) => {
  const { phone, amount, accountId, provider } = req.body;
  if (!phone || !amount) throw httpError(400, "phone and amount are required");

  const topup = await prisma.topup.create({
    data: {
      userId: req.userId,
      accountId: accountId || null,
      phone,
      amount: parseFloat(amount),
      provider: provider || "VIETTEL",
      status: "SUCCESS"
    }
  });

  // Tạo transaction record
  await prisma.transaction.create({
    data: {
      userId: req.userId,
      fromAccountId: accountId || null,
      amount: parseFloat(amount),
      category: "topup",
      description: `Nạp tiền điện thoại ${phone} - ${provider || "VIETTEL"}`,
      type: "TOPUP",
      status: "COMPLETED"
    }
  });

  res.status(201).json(topup);
});

// ==================== E-WALLET ====================
const getEwalletTransactions = asyncHandler(async (req, res) => {
  const txs = await prisma.ewalletTransaction.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json(txs);
});

const createEwalletTransaction = asyncHandler(async (req, res) => {
  const { toWallet, amount, accountId } = req.body;
  if (!toWallet || !amount) throw httpError(400, "toWallet and amount are required");

  const tx = await prisma.ewalletTransaction.create({
    data: {
      userId: req.userId,
      fromAccountId: accountId || null,
      toWallet,
      amount: parseFloat(amount),
      status: "SUCCESS"
    }
  });

  // Tạo transaction record
  await prisma.transaction.create({
    data: {
      userId: req.userId,
      fromAccountId: accountId || null,
      amount: parseFloat(amount),
      category: "ewallet",
      description: `Chuyển tiền đến ví ${toWallet}`,
      type: "PAYMENT",
      status: "COMPLETED"
    }
  });

  res.status(201).json(tx);
});

// ==================== QR PAY ====================
const getQrPayTransactions = asyncHandler(async (req, res) => {
  const txs = await prisma.qrPayTransaction.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json(txs);
});

const createQrPayTransaction = asyncHandler(async (req, res) => {
  const { qrData, amount, accountId, merchantName } = req.body;
  if (!qrData || !amount) throw httpError(400, "qrData and amount are required");

  const tx = await prisma.qrPayTransaction.create({
    data: {
      userId: req.userId,
      accountId: accountId || null,
      qrData,
      amount: parseFloat(amount),
      merchantName: merchantName || null,
      status: "SUCCESS"
    }
  });

  // Tạo transaction record
  await prisma.transaction.create({
    data: {
      userId: req.userId,
      fromAccountId: accountId || null,
      amount: parseFloat(amount),
      category: "qrpay",
      description: merchantName ? `Thanh toán QR tại ${merchantName}` : "Thanh toán QR",
      type: "PAYMENT",
      status: "COMPLETED"
    }
  });

  res.status(201).json(tx);
});

// ==================== SCHEDULED PAYMENTS ====================
const getScheduledPayments = asyncHandler(async (req, res) => {
  const payments = await prisma.scheduledPayment.findMany({
    where: { userId: req.userId },
    orderBy: { nextRunAt: "asc" }
  });
  res.json(payments);
});

const createScheduledPayment = asyncHandler(async (req, res) => {
  const { accountId, type, recipient, amount, frequency, nextRunAt } = req.body;
  if (!accountId || !type || !recipient || !amount) {
    throw httpError(400, "accountId, type, recipient, and amount are required");
  }

  const payment = await prisma.scheduledPayment.create({
    data: {
      userId: req.userId,
      accountId,
      type,
      recipient,
      amount: parseFloat(amount),
      frequency: frequency || "ONCE",
      nextRunAt: nextRunAt ? new Date(nextRunAt) : new Date()
    }
  });

  res.status(201).json(payment);
});

const updateScheduledPayment = asyncHandler(async (req, res) => {
  const payment = await prisma.scheduledPayment.findUnique({ where: { id: req.params.id } });
  if (!payment || payment.userId !== req.userId) throw httpError(404, "Scheduled payment not found");

  res.json(await prisma.scheduledPayment.update({
    where: { id: req.params.id },
    data: req.body
  }));
});

const deleteScheduledPayment = asyncHandler(async (req, res) => {
  const payment = await prisma.scheduledPayment.findUnique({ where: { id: req.params.id } });
  if (!payment || payment.userId !== req.userId) throw httpError(404, "Scheduled payment not found");

  await prisma.scheduledPayment.delete({ where: { id: req.params.id } });
  res.json({ message: "Scheduled payment deleted" });
});

const toggleScheduledPayment = asyncHandler(async (req, res) => {
  const payment = await prisma.scheduledPayment.findUnique({ where: { id: req.params.id } });
  if (!payment || payment.userId !== req.userId) throw httpError(404, "Scheduled payment not found");

  res.json(await prisma.scheduledPayment.update({
    where: { id: req.params.id },
    data: { isActive: !payment.isActive }
  }));
});

// ==================== BILL PAY ====================
const payBill = asyncHandler(async (req, res) => {
  const { billId, accountId } = req.body;
  if (!billId) throw httpError(400, "billId is required");

  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill || bill.userId !== req.userId) throw httpError(404, "Bill not found");
  if (bill.status === "PAID") throw httpError(400, "Bill already paid");

  // Update bill status
  const updatedBill = await prisma.bill.update({
    where: { id: billId },
    data: { status: "PAID" }
  });

  // Tạo transaction record
  await prisma.transaction.create({
    data: {
      userId: req.userId,
      fromAccountId: accountId || null,
      amount: Number(bill.amount),
      category: bill.category,
      description: `Thanh toán hóa đơn: ${bill.name}`,
      type: "PAYMENT",
      status: "COMPLETED"
    }
  });

  res.json(updatedBill);
});

// ==================== SPLIT BILL SETTLE ====================
const settleSplitBill = asyncHandler(async (req, res) => {
  const { splitBillId, accountId } = req.body;
  if (!splitBillId) throw httpError(400, "splitBillId is required");

  const splitBill = await prisma.splitBill.findUnique({ where: { id: splitBillId } });
  if (!splitBill || splitBill.creatorId !== req.userId) throw httpError(404, "Split bill not found");

  // Update status
  const updated = await prisma.splitBill.update({
    where: { id: splitBillId },
    data: { status: "SETTLED" }
  });

  // Tạo transaction record
  await prisma.transaction.create({
    data: {
      userId: req.userId,
      fromAccountId: accountId || null,
      amount: Number(splitBill.totalAmount),
      category: "splitbill",
      description: `Thanh toán chia bill: ${splitBill.title}`,
      type: "PAYMENT",
      status: "COMPLETED"
    }
  });

  res.json(updated);
});

module.exports = {
  // Topup
  getTopups, createTopup,
  // E-wallet
  getEwalletTransactions, createEwalletTransaction,
  // QR Pay
  getQrPayTransactions, createQrPayTransaction,
  // Scheduled
  getScheduledPayments, createScheduledPayment, updateScheduledPayment, deleteScheduledPayment, toggleScheduledPayment,
  // Bill
  payBill,
  // Split Bill
  settleSplitBill
};
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

const getTransactions = asyncHandler(async (req, res) => {
  const { accountId, startDate, endDate, category, limit = 50, offset = 0 } = req.query;
  const where = { userId: req.userId };
  if (accountId) where.OR = [
    { fromAccountId: accountId },
    { toAccountId: accountId }
  ];
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }
  if (category) where.category = category;

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
    skip: parseInt(offset)
  });
  res.json(transactions);
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: req.params.id }
  });
  if (!transaction || transaction.userId !== req.userId) throw httpError(404, "Transaction not found");
  res.json(transaction);
});

module.exports = {
  getTransactions,
  getTransaction
};
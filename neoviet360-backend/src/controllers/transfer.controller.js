const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

const transfer = asyncHandler(async (req, res) => {
  const { fromAccountId, toAccountId, toAccountNumber, amount, description, category } = req.body;
  if (!fromAccountId || (!toAccountId && !toAccountNumber) || !amount) throw httpError(400, "Missing required fields");
  if (amount <= 0) throw httpError(400, "Amount must be positive");

  const result = await prisma.$transaction(async (tx) => {
    const from = await tx.account.findUnique({ where: { id: fromAccountId } });
    if (!from || from.userId !== req.userId) throw httpError(404, "Source account not found");
    if (from.balance < amount) throw httpError(400, "Insufficient balance");

    const to = toAccountId
      ? await tx.account.findUnique({ where: { id: toAccountId } })
      : await tx.account.findFirst({ where: { accountNumber: toAccountNumber } });
    if (!to) throw httpError(404, "Destination account not found");

    await tx.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } }
    });
    await tx.account.update({
      where: { id: to.id },
      data: { balance: { increment: amount } }
    });

    const transaction = await tx.transaction.create({
      data: {
        userId: req.userId,
        fromAccountId,
        toAccountId: to.id,
        amount: parseFloat(amount),
        currency: from.currency,
        category: category || "TRANSFER",
        description: description || "Transfer",
        type: "TRANSFER",
        status: "COMPLETED"
      }
    });

    const rewardPoints = Math.floor(amount / 1000);
    if (rewardPoints > 0) {
      await tx.reward.create({
        data: {
          userId: req.userId,
          transactionId: transaction.id,
          points: rewardPoints,
          type: "EARN",
          description: `Transfer reward: ${rewardPoints} NeoPoints`
        }
      });
    }

    const budgets = await tx.budget.findMany({
      where: { userId: req.userId, category: category || "TRANSFER" }
    });
    for (const budget of budgets) {
      const spent = await tx.transaction.aggregate({
        where: {
          userId: req.userId,
          category: budget.category,
          createdAt: { gte: budget.startDate, lte: budget.endDate || new Date() }
        },
        _sum: { amount: true }
      });
      const totalSpent = spent._sum.amount || 0;
      if (totalSpent > budget.limitAmount) {
        await tx.notification.create({
          data: {
            userId: req.userId,
            type: "BUDGET",
            title: "Budget Exceeded",
            message: `You have exceeded your ${budget.category} budget of ${budget.limitAmount.toLocaleString()} VND`
          }
        });
      }
    }

    return transaction;
  });

  res.status(201).json(result);
});

module.exports = { transfer };
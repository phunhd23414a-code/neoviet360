const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

// Budgets
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await prisma.budget.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" }
  });
  const budgetsWithSpent = await Promise.all(budgets.map(async (b) => {
    const spent = await prisma.transaction.aggregate({
      where: {
        userId: req.userId,
        category: b.category,
        createdAt: { gte: b.startDate, lte: b.endDate || new Date() }
      },
      _sum: { amount: true }
    });
    return { ...b, spent: spent._sum.amount || 0 };
  }));
  res.json(budgetsWithSpent);
});

const createBudget = asyncHandler(async (req, res) => {
  const { category, limitAmount, period, startDate, endDate } = req.body;
  if (!category || !limitAmount) throw httpError(400, "Category and limitAmount are required");
  const budget = await prisma.budget.create({
    data: { userId: req.userId, category, limitAmount: parseFloat(limitAmount), period, startDate: startDate ? new Date(startDate) : new Date(), endDate: endDate ? new Date(endDate) : null }
  });
  res.status(201).json(budget);
});

const updateBudget = asyncHandler(async (req, res) => {
  const budget = await prisma.budget.findUnique({ where: { id: req.params.id } });
  if (!budget || budget.userId !== req.userId) throw httpError(404, "Budget not found");
  res.json(await prisma.budget.update({ where: { id: req.params.id }, data: req.body }));
});

const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await prisma.budget.findUnique({ where: { id: req.params.id } });
  if (!budget || budget.userId !== req.userId) throw httpError(404, "Budget not found");
  await prisma.budget.delete({ where: { id: req.params.id } });
  res.json({ message: "Budget deleted" });
});

// Savings Goals
const getSavingsGoals = asyncHandler(async (req, res) => {
  const goals = await prisma.savingsGoal.findMany({
    where: { userId: req.userId },
    include: { account: true }
  });
  res.json(goals);
});

const createSavingsGoal = asyncHandler(async (req, res) => {
  const { accountId, name, targetAmount, deadline } = req.body;
  if (!name || !targetAmount) throw httpError(400, "Name and targetAmount are required");
  const goal = await prisma.savingsGoal.create({
    data: { userId: req.userId, accountId, name, targetAmount: parseFloat(targetAmount), deadline: deadline ? new Date(deadline) : null }
  });
  res.status(201).json(goal);
});

const updateSavingsGoal = asyncHandler(async (req, res) => {
  const goal = await prisma.savingsGoal.findUnique({ where: { id: req.params.id } });
  if (!goal || goal.userId !== req.userId) throw httpError(404, "Savings goal not found");
  res.json(await prisma.savingsGoal.update({ where: { id: req.params.id }, data: req.body }));
});

// Loans
const getLoans = asyncHandler(async (req, res) => {
  res.json(await prisma.loan.findMany({ where: { userId: req.userId } }));
});

const createLoan = asyncHandler(async (req, res) => {
  const { amount, interestRate, termMonths, monthlyPayment } = req.body;
  if (!amount || !interestRate) throw httpError(400, "Amount and interestRate are required");
  const loan = await prisma.loan.create({
    data: { userId: req.userId, amount: parseFloat(amount), interestRate: parseFloat(interestRate), termMonths: parseInt(termMonths), monthlyPayment: parseFloat(monthlyPayment), remaining: parseFloat(amount) }
  });
  res.status(201).json(loan);
});

// Cards
const getCards = asyncHandler(async (req, res) => {
  res.json(await prisma.card.findMany({ where: { userId: req.userId }, include: { account: true } }));
});

const createCard = asyncHandler(async (req, res) => {
  const { accountId, cardNumber, type, limitAmount, expiresAt } = req.body;
  if (!accountId || !cardNumber) throw httpError(400, "accountId and cardNumber are required");
  const card = await prisma.card.create({
    data: { userId: req.userId, accountId, cardNumber, type: type || "DEBIT", limitAmount: parseFloat(limitAmount) || 0, expiresAt: expiresAt ? new Date(expiresAt) : null }
  });
  res.status(201).json(card);
});

const toggleCardFreeze = asyncHandler(async (req, res) => {
  const card = await prisma.card.findUnique({ where: { id: req.params.id } });
  if (!card || card.userId !== req.userId) throw httpError(404, "Card not found");
  res.json(await prisma.card.update({ where: { id: req.params.id }, data: { isFrozen: !card.isFrozen } }));
});

// Bills
const getBills = asyncHandler(async (req, res) => {
  res.json(await prisma.bill.findMany({ where: { userId: req.userId } }));
});

const createBill = asyncHandler(async (req, res) => {
  const { name, amount, category, dueDate, isRecurring } = req.body;
  if (!name || !amount) throw httpError(400, "Name and amount are required");
  const bill = await prisma.bill.create({
    data: { userId: req.userId, name, amount: parseFloat(amount), category, dueDate: dueDate ? new Date(dueDate) : null, isRecurring: !!isRecurring }
  });
  res.status(201).json(bill);
});

const updateBill = asyncHandler(async (req, res) => {
  const bill = await prisma.bill.findUnique({ where: { id: req.params.id } });
  if (!bill || bill.userId !== req.userId) throw httpError(404, "Bill not found");
  res.json(await prisma.bill.update({ where: { id: req.params.id }, data: req.body }));
});

const deleteBill = asyncHandler(async (req, res) => {
  const bill = await prisma.bill.findUnique({ where: { id: req.params.id } });
  if (!bill || bill.userId !== req.userId) throw httpError(404, "Bill not found");
  await prisma.bill.delete({ where: { id: req.params.id } });
  res.json({ message: "Bill deleted" });
});

// Split Bills
const getSplitBills = asyncHandler(async (req, res) => {
  res.json(await prisma.splitBill.findMany({ where: { creatorId: req.userId } }));
});

const createSplitBill = asyncHandler(async (req, res) => {
  const { title, totalAmount, members } = req.body;
  if (!title || !totalAmount) throw httpError(400, "Title and totalAmount are required");
  const splitBill = await prisma.splitBill.create({
    data: { creatorId: req.userId, title, totalAmount: parseFloat(totalAmount), members: members || [], status: "PENDING" }
  });
  res.status(201).json(splitBill);
});

// Rewards
const getRewards = asyncHandler(async (req, res) => {
  const rewards = await prisma.reward.findMany({ where: { userId: req.userId }, orderBy: { createdAt: "desc" } });
  const total = rewards.reduce((sum, r) => sum + r.points, 0);
  res.json({ rewards, totalPoints: total });
});

// Notifications
const getNotifications = asyncHandler(async (req, res) => {
  res.json(await prisma.notification.findMany({ where: { userId: req.userId }, orderBy: { createdAt: "desc" }, take: 50 }));
});

const markNotificationRead = asyncHandler(async (req, res) => {
  await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
  res.json({ message: "Notification marked as read" });
});

// Chat History
const getChatHistory = asyncHandler(async (req, res) => {
  res.json(await prisma.chatHistory.findMany({ where: { userId: req.userId }, orderBy: { createdAt: "asc" }, take: 100 }));
});

const addChatMessage = asyncHandler(async (req, res) => {
  const { role, content } = req.body;
  if (!role || !content) throw httpError(400, "role and content are required");
  const message = await prisma.chatHistory.create({
    data: { userId: req.userId, role, content }
  });
  res.status(201).json(message);
});

module.exports = {
  getBudgets, createBudget, updateBudget, deleteBudget,
  getSavingsGoals, createSavingsGoal, updateSavingsGoal,
  getLoans, createLoan,
  getCards, createCard, toggleCardFreeze,
  getBills, createBill, updateBill, deleteBill,
  getSplitBills, createSplitBill,
  getRewards,
  getNotifications, markNotificationRead,
  getChatHistory, addChatMessage
};
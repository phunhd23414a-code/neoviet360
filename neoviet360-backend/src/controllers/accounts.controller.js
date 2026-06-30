const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" }
  });
  res.json(accounts);
});

const getAccount = asyncHandler(async (req, res) => {
  const account = await prisma.account.findUnique({
    where: { id: req.params.id }
  });
  if (!account || account.userId !== req.userId) throw httpError(404, "Account not found");
  res.json(account);
});

const createAccount = asyncHandler(async (req, res) => {
  const { type, name, accountNumber, currency } = req.body;
  if (!name || !accountNumber) throw httpError(400, "Name and accountNumber are required");

  const account = await prisma.account.create({
    data: {
      userId: req.userId,
      type: type || "CHECKING",
      name,
      accountNumber,
      currency: currency || "VND",
      isDefault: false
    }
  });
  res.status(201).json(account);
});

const updateAccount = asyncHandler(async (req, res) => {
  const account = await prisma.account.findUnique({
    where: { id: req.params.id }
  });
  if (!account || account.userId !== req.userId) throw httpError(404, "Account not found");

  const updated = await prisma.account.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount
};
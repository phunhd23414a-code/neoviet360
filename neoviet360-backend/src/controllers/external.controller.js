const axios = require("axios");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

// FX Rates
const getFxRates = asyncHandler(async (req, res) => {
  const cached = await prisma.fxRate.findMany({ orderBy: { fetchedAt: "desc" }, take: 20 });
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (cached.length && cached[0].fetchedAt > oneHourAgo) {
    return res.json(cached);
  }
  try {
    const { data } = await axios.get("https://api.exchangerate-api.com/v4/latest/VND", { timeout: 5000 });
    const rates = Object.entries(data.rates).slice(0, 10).map(([currency, rate]) => ({
      fromCurrency: "VND",
      toCurrency: currency,
      rate: rate / data.rates.VND,
      source: "exchangerate-api"
    }));
    await prisma.fxRate.deleteMany();
    await prisma.fxRate.createMany({ data: rates.map(r => ({ ...r, fetchedAt: new Date() })) });
    res.json(rates);
  } catch {
    res.json(cached.length ? cached : []);
  }
});

// Crypto
const getCryptoPrices = asyncHandler(async (req, res) => {
  const cached = await prisma.cryptoPrice.findMany({ orderBy: { fetchedAt: "desc" }, take: 20 });
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (cached.length && cached[0].fetchedAt > oneHourAgo) {
    return res.json(cached);
  }
  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,polkadot", { timeout: 5000 });
    const prices = data.map(c => ({
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      priceUsd: c.current_price,
      change24h: c.price_change_percentage_24h,
      marketCap: c.market_cap,
      source: "coingecko"
    }));
    await prisma.cryptoPrice.deleteMany();
    await prisma.cryptoPrice.createMany({ data: prices.map(p => ({ ...p, fetchedAt: new Date() })) });
    res.json(prices);
  } catch {
    res.json(cached.length ? cached : []);
  }
});

// AI Chat with Gemini
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) throw httpError(400, "Message is required");

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: {
      accounts: true,
      budgets: true,
      savingsGoals: true,
      transactions: { take: 20, orderBy: { createdAt: "desc" } }
    }
  });

  const totalBalance = user.accounts.reduce((s, a) => s + parseFloat(a.balance), 0);
  const totalBudget = user.budgets.reduce((s, b) => s + parseFloat(b.limitAmount), 0);
  const totalSavings = user.savingsGoals.reduce((s, g) => s + parseFloat(g.currentAmount || 0), 0);

  const context = `User: ${user.name}, Email: ${user.email}
Accounts: ${user.accounts.length} accounts, Total Balance: ${totalBalance.toLocaleString()} VND
Budgets: ${user.budgets.length} active budgets, Total: ${totalBudget.toLocaleString()} VND
Savings Goals: ${user.savingsGoals.length} goals, Total Saved: ${totalSavings.toLocaleString()} VND
Recent Transactions: ${user.transactions.length} transactions`;

  const systemPrompt = `You are NeoViet360 AI Financial Coach. User context:\n${context}\n\nProvide helpful, accurate financial advice in Vietnamese. Keep responses concise and actionable.`;

  const { data } = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }]
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không thể trả lời lúc này.";

  await prisma.chatHistory.createMany({
    data: [
      { userId: req.userId, role: "user", content: message },
      { userId: req.userId, role: "assistant", content: reply }
    ]
  });

  res.json({ reply, context: { totalBalance, totalBudget, totalSavings } });
});

// Carbon tracking
const getCarbonTracks = asyncHandler(async (req, res) => {
  res.json(await prisma.carbonTrack.findMany({ where: { userId: req.userId }, orderBy: { createdAt: "desc" }, take: 50 }));
});

const addCarbonTrack = asyncHandler(async (req, res) => {
  const { transactionId, category, carbonKg } = req.body;
  const track = await prisma.carbonTrack.create({
    data: { userId: req.userId, transactionId, category, carbonKg: parseFloat(carbonKg) }
  });
  res.status(201).json(track);
});

module.exports = {
  getFxRates,
  getCryptoPrices,
  chat,
  getCarbonTracks,
  addCarbonTrack
};
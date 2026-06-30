const express = require("express");
const authGuard = require("../middleware/authGuard");
const f = require("../controllers/features.controller");

const router = express.Router();
router.use(authGuard);

router.get("/budgets", f.getBudgets);
router.post("/budgets", f.createBudget);
router.put("/budgets/:id", f.updateBudget);
router.delete("/budgets/:id", f.deleteBudget);

router.get("/savings", f.getSavingsGoals);
router.post("/savings", f.createSavingsGoal);
router.put("/savings/:id", f.updateSavingsGoal);

router.get("/loans", f.getLoans);
router.post("/loans", f.createLoan);

router.get("/cards", f.getCards);
router.post("/cards", f.createCard);
router.put("/cards/:id/freeze", f.toggleCardFreeze);

router.get("/bills", f.getBills);
router.post("/bills", f.createBill);
router.put("/bills/:id", f.updateBill);
router.delete("/bills/:id", f.deleteBill);

router.get("/split-bills", f.getSplitBills);
router.post("/split-bills", f.createSplitBill);

router.get("/rewards", f.getRewards);

router.get("/notifications", f.getNotifications);
router.put("/notifications/:id/read", f.markNotificationRead);

router.get("/chat-history", f.getChatHistory);
router.post("/chat-history", f.addChatMessage);

module.exports = router;
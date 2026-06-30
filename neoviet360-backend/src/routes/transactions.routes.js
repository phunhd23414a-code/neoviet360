const express = require("express");
const authGuard = require("../middleware/authGuard");
const transactions = require("../controllers/transactions.controller");

const router = express.Router();

router.use(authGuard);

router.get("/", transactions.getTransactions);
router.get("/:id", transactions.getTransaction);

module.exports = router;
const express = require("express");
const authGuard = require("../middleware/authGuard");
const accounts = require("../controllers/accounts.controller");

const router = express.Router();

router.use(authGuard);

router.get("/", accounts.getAccounts);
router.post("/", accounts.createAccount);
router.get("/:id", accounts.getAccount);
router.put("/:id", accounts.updateAccount);

module.exports = router;
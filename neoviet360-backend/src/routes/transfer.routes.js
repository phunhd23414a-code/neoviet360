const express = require("express");
const authGuard = require("../middleware/authGuard");
const { transfer } = require("../controllers/transfer.controller");

const router = express.Router();

router.use(authGuard);
router.post("/", transfer);

module.exports = router;
const express = require("express");
const authGuard = require("../middleware/authGuard");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", authGuard, auth.me);

router.get("/google", auth.googleStart);
router.get("/google/callback", auth.googleCallback);

router.get("/zalo", auth.zaloStart);
router.get("/zalo/callback", auth.zaloCallback);

module.exports = router;
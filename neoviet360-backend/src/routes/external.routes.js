const express = require("express");
const authGuard = require("../middleware/authGuard");
const e = require("../controllers/external.controller");

const router = express.Router();

router.get("/fx-rates", e.getFxRates);
router.get("/crypto", e.getCryptoPrices);
router.post("/chat", authGuard, e.chat);
router.get("/carbon", authGuard, e.getCarbonTracks);
router.post("/carbon", authGuard, e.addCarbonTrack);

module.exports = router;
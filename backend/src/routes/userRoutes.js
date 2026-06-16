const express = require('express');
const router = express.Router();
const { createUser, loginUser, getMe, saveDefaultPaymentMethod } = require('../controllers/userController');
const {protect} = require("../middleware/authMiddleware");
const {saveCardDetails, topupWithCard} = require("../controllers/cardController");
const {topupWithBank} = require('../controllers/bankController');
const {getUserTransactions} = require('../controllers/userController');

// POST /api/user/register
router.post('/register', createUser);
// POST /api/user/login
router.post('/login', loginUser);

router.post("/me/card", protect, saveCardDetails);
router.post("/me/default-payment", protect, saveDefaultPaymentMethod);
router.post("/wallet/topup-card", protect, topupWithCard);
router.post("/wallet/topup-bank", protect, topupWithBank);

router.get("/transactions", protect, getUserTransactions);

router.get("/me", protect, getMe);


module.exports = router;
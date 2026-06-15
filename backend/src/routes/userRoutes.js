const express = require('express');
const router = express.Router();
const { createUser, loginUser, getMe, saveDefaultPaymentMethod } = require('../controllers/userController');
const {protect} = require("../middleware/authMiddleware");
const {saveCardDetails} = require("../controllers/cardController");

// POST /api/user/register
router.post('/register', createUser);
// POST /api/user/login
router.post('/login', loginUser);

router.post("/me/card", protect, saveCardDetails);
router.post("/me/default-payment", protect, saveDefaultPaymentMethod);

router.get("/me", protect, getMe);


module.exports = router;
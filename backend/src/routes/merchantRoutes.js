const express = require('express');
const router = express.Router();
const { registerMerchant, loginMerchant, getMerchantMe } = require('../controllers/merchantController');
const { protectMerchant } = require('../middleware/merchantAuth');

// POST /api/merchant/register
router.post('/register', registerMerchant);

// POST /api/merchant/login
router.post('/login', loginMerchant);

// GET /api/merchant/me
router.get('/me', protectMerchant, getMerchantMe);

module.exports = router;
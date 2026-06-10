const express = require('express');
const router = express.Router();
const { payWithBiometric } = require('../controllers/paymentController');

// POST /api/payments/pay-with-biometric
router.post('/pay-with-biometric', payWithBiometric);

module.exports = router;

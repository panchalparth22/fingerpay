const express = require('express');
const router = express.Router();
const { payWithBiometric, payWithDefaultMethod } = require('../controllers/paymentController');

// POST /api/payments/pay-with-biometric
router.post('/pay-with-biometric', payWithBiometric);

// POST /api/payments/pay
router.post('/pay', payWithDefaultMethod);

module.exports = router;

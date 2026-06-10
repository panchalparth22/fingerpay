const { processBiometricPayment } = require('../services/paymentService');

const payWithBiometric = async (req, res) => {
  try {
    const { biometricId, amount } = req.body;

    // Basic validation
    if (!biometricId || typeof biometricId !== 'string' || biometricId.trim() === '') {
      return res.status(400).json({ error: 'Biometric ID is required' });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const result = await processBiometricPayment({ biometricId, amount });
    return res.status(200).json({ user: result.user, transaction: result.transaction });
  } catch (error) {
    // Let the error handler middleware deal with known error codes
    throw error;
  }
};

module.exports = { payWithBiometric };

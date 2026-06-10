const User = require('../models/User');
const Transaction = require('../models/Transaction');

const processBiometricPayment = async ({ biometricId, amount }) => {
  // Find user by biometricId
  const user = await User.findOne({ biometricId });
  if (!user) {
    throw { code: 'UNKNOWN_BIOMETRIC', message: 'Biometric ID not recognized' };
  }

  // Check if amount is valid (positive number)
  if (typeof amount !== 'number' || amount <= 0) {
    throw { code: 'INVALID_AMOUNT', message: 'Amount must be a positive number' };
  }

  // Check sufficient balance
  if (user.balance < amount) {
    throw { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds' };
  }

  // Deduct amount from user balance
  user.balance -= amount;
  await user.save();

  // Create transaction record
  const transaction = new Transaction({
    userId: user._id,
    amount: amount,
    type: 'debit',
    description: 'Payment via biometric authentication',
    status: 'completed'
  });
  await transaction.save();

  return { user, transaction };
};

module.exports = { processBiometricPayment };

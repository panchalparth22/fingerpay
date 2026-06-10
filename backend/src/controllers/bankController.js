const User = require('../models/User');
const Transaction = require('../models/Transaction');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('name email balance createdAt');
    res.json(users);
  } catch (error) {
    throw error;
  }
};

const getUserWithTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email balance createdAt');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 }) // most recent first
      .select('amount type description status createdAt');

    res.json({ user, transactions });
  } catch (error) {
    throw error;
  }
};

module.exports = { getUsers, getUserWithTransactions };

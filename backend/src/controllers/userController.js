const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;

    // Basic validation for signup step
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hashing the password before storing

    const user = new User({
      name,
      email,
      password: hashedPassword, // store hash, not plain password
      phone_number,
      // biometricId, address, etc. will be added later via profile verification
    });

    await user.save();

    // Never send password back
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      balance: user.balance,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Server error while creating user' });
  }
};

module.exports = { createUser };
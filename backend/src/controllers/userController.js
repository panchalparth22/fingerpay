const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

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

    const token = generateToken(user._id); 

    // Never send password back
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      balance: user.balance,
    }, token);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Server error while creating user' });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('Login request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found for email:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match?', isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
const token = generateToken(user._id); 
    return res.json({
      user: {
        id: user._id,
        email: user.email,
        phone_number: user.phone_number,
        name: user.name,
        balance: user.balance,
        emailVerified: user.emailVerified,
        cardDetails: user.cardDetails,
        accountDetails: user.accountDetails,
      },
      token,
      role: "customer",
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error while logging in' });
  }
};

const getMe = async (req, res) => {
  try {
    // protect middleware should set req.user.id or req.user._id
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        emailVerified: user.emailVerified,
        cardDetails: user.cardDetails
          ? {
              cardNumber: user.cardDetails.cardNumber,
              expiryDate: user.cardDetails.expiryDate,
              userName: user.cardDetails.userName,
            }
          : null,
        accountDetails: user.accountDetails
          ? {
              sortCode: user.accountDetails.sortCode,
              accountNumber: user.accountDetails.accountNumber,
              userName: user.accountDetails.userName,
              bankName: user.accountDetails.bankName,
            }
          : null,
        defaultPaymentMethod: user.defaultPaymentMethod,
      },
    });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};



const saveDefaultPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { defaultPaymentMethod } = req.body;

    // Validate that it's either 'card' or 'bank'
    if (!defaultPaymentMethod || !['card', 'bank'].includes(defaultPaymentMethod)) {
      return res.status(400).json({ message: "Invalid default payment method" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          defaultPaymentMethod,
        },
      },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        emailVerified: user.emailVerified,
        defaultPaymentMethod: user.defaultPaymentMethod,
      },
    });
  } catch (err) {
    console.error("saveDefaultPaymentMethod error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, loginUser, getMe, saveDefaultPaymentMethod };
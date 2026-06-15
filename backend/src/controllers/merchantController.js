const Merchant = require('../models/Merchant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (merchantId) =>
  jwt.sign({ id: merchantId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerMerchant = async (req, res) => {
  try {
    const { company_name, merchant_name, email, password, phone_number, VAT_number, license_number, address, bank_details } = req.body;

    // Basic validation
    if (!company_name || !merchant_name || !email || !password || !phone_number || !VAT_number || !license_number) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if merchant already exists
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return res.status(400).json({ error: 'Merchant with this email already exists' });
    }

    // Create merchant instance
    const merchant = new Merchant({
      company_name,
      merchant_name,
      email,
      password, // will be hashed via pre-save hook
      phone_number,
      VAT_number,
      license_number,
      address: address || '',
      bank_details: bank_details || {}
    });

    await merchant.save();

    const token = generateToken(merchant._id);

    // Return merchant info (without password)
    res.status(201).json({
      id: merchant._id,
      company_name: merchant.company_name,
      merchant_name: merchant.merchant_name,
      email: merchant.email,
      phone_number: merchant.phone_number,
      VAT_number: merchant.VAT_number,
      license_number: merchant.license_number,
      balance: merchant.balance,
      token
    });
  } catch (error) {
    console.error('Error registering merchant:', error);
    return res.status(500).json({ error: 'Server error while registering merchant' });
  }
};

const loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await merchant.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(merchant._id);

    res.json({
      id: merchant._id,
      company_name: merchant.company_name,
      merchant_name: merchant.merchant_name,
      email: merchant.email,
      phone_number: merchant.phone_number,
      VAT_number: merchant.VAT_number,
      license_number: merchant.license_number,
      balance: merchant.balance,
      token
    });
  } catch (err) {
    console.error('Merchant login error:', err);
    return res.status(500).json({ error: 'Server error while logging in' });
  }
};

const getMerchantMe = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.merchant.id).select('-password');
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }
    res.json(merchant);
  } catch (err) {
    console.error('Get merchant error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerMerchant, loginMerchant, getMerchantMe };
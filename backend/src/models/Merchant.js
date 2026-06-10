const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true
  },
  merchant_name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  bank_details: {
    bankName: String,
    accountNumber: String,
    sortCode: String
  },
  phone_number: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  VAT_number: {
    type: String,
    required: true
  },
  license_number: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Merchant', MerchantSchema);

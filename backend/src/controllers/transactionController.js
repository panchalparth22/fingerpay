// controllers/transactionController.js
const User = require("../models/User");
const Merchant = require("../models/Merchant");
const Transaction = require("../models/Transaction");

// POST /api/transactions/charge-by-email
// Body: { customerEmail, amount }
// Auth: merchant only
const chargeCustomer = async (req, res) => {
  try {
    const { customerEmail, amount } = req.body;
    console.log("request: ",req.merchant);

    // 1. Validate body
    if (!customerEmail || !amount) {
      return res
        .status(400)
        .json({ error: "customerEmail and amount are required" });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }

    // 2. Find merchant from auth
    const merchantId = req.merchant.id; // assumes merchant is logged in
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found" });
    }

    // 3. Find customer by email
    const customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // 4. Check customer balance (if this is a charge)
    if ((customer.balance || 0) < numericAmount) {
      return res.status(400).json({ error: "Insufficient customer balance" });
    }

    // 5. Apply charge: subtract from customer balance
    customer.balance = (customer.balance || 0) - numericAmount;
    await customer.save();

    // 6. Create transaction record
    const transaction = await Transaction.create({
      user: customer._id,
      merchant: merchant._id,
      merchantName:
        merchant.merchant_name || merchant.company_name || merchant.email,
      merchantImage: merchant.logoUrl || null, // adjust field name
      amount: numericAmount,
    });

    // 7. Optionally push to customer's transactions array if you added it
    if (customer.transactions) {
      customer.transactions.push(transaction._id);
      await customer.save();
    }

    // 8. Respond with updated customer + transaction
    return res.json({
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        phone_number: customer.phone_number,
        balance: customer.balance,
        emailVerified: customer.emailVerified,
      },
      transaction: {
        id: transaction._id,
        merchantName: transaction.merchantName,
        merchantImage: transaction.merchantImage,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
      },
    });
  } catch (err) {
    console.error("Error in chargeCustomerByEmail:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { chargeCustomer };

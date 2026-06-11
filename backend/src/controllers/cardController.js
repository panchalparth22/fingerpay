import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const saveCardDetails = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { cardNumber, cvv, expiryDate, userName } = req.body;

    if (!cardNumber || !cvv || !expiryDate || !userName) {
      return res.status(400).json({ message: "Missing card fields" });
    }

    // clean up number (remove spaces)
    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (cleanNumber.length < 12) {
      return res.status(400).json({ message: "Invalid card number" });
    }

    // hash CVV (for learning only; in real life you should not store CVV at all)
    const cvvHash = await bcrypt.hash(cvv, 10);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          cardDetails: {
            cardNumber: cleanNumber, // for learning: full number
            cvv: cvvHash,
            expiryDate,              // e.g. "05/25"
            userName,
          },
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
        cardDetails: {
          cardNumber: user.cardDetails.cardNumber,
          expiryDate: user.cardDetails.expiryDate,
          userName: user.cardDetails.userName,
          // do NOT send cvv hash back
        },
      },
    });
  } catch (err) {
    console.error("saveCardDetails error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
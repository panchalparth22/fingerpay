import jwt from "jsonwebtoken";
import Merchant from "../models/Merchant.js";

export const protectMerchant = async (req, res, next) => {
  let token;

  // Expect: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach merchant (without password) to request
      const merchant = await Merchant.findById(decoded.id).select("-password");
      if (!merchant) {
        return res.status(401).json({ message: "Merchant not found" });
      }

      req.merchant = { id: merchant._id, email: merchant.email, name: merchant.merchant_name };
      return next();
    } catch (err) {
      console.error("Merchant auth error:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
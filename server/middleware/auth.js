import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ success: false, message: "ลงทะเบียนนowner ก่อน " });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    
    req.user = user; // ✅ ต้อง attach user
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Token invalid" });
  }
};

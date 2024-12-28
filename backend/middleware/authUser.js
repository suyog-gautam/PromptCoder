import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { redisCLient } from "../services/redis.service.js";
import dotenv from "dotenv";
dotenv.config();

export const authUser = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers?.authorization?.startsWith("bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  const isLoggedOut = await redisCLient.get(token);
  if (isLoggedOut) {
    res.cookie("token", "");
    return res.status(401).json({ message: "Unauthorized: Session expired" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Find user
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { redisCLient } from "../services/redis.service.js";
const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const user = await createUser({ email, password });
    const token = user.generateJWT();
    res
      .status(201)
      .json({
        user,
        token,
        success: true,
        message: "User created Successfully",
      });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    if (!(await user.isValidPassword(password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = await user.generateJWT();
    res
      .status(200)
      .json({ success: true, user, token, message: "Login successful" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
const profileController = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
const logoutController = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers?.authorization?.startsWith("bearer")
        ? req.headers.authorization.split(" ")[1]
        : null);
    redisCLient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
export {
  createUserController,
  loginController,
  profileController,
  logoutController,
};

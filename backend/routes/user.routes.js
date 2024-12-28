import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/authUser.js";
const userRouter = Router();

userRouter.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 6 characters long"),
  userController.createUserController
);
userRouter.post(
  "/login",

  userController.loginController
);
userRouter.get("/profile", authUser, userController.profileController);
userRouter.get("/logout", authUser, userController.logoutController);
export { userRouter };

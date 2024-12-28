import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import { userRouter } from "./routes/user.routes.js";
import { redisConnect } from "./services/redis.service.js";
connectDB();
redisConnect();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users", userRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;

import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const redisCLient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
const redisConnect = () => {
  redisCLient.on("connect", () => {
    console.log("Redis Client Connected");
  });
  redisCLient.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });
};

export { redisConnect, redisCLient };

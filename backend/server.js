import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Project from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(new Error("Invalid project ID"));
    }
    socket.project = await Project.findById(projectId);
    if (!socket.project) {
      return next(new Error("Project not found"));
    }
    if (!token) {
      return next(new Error("Authentication error"), false);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"), false);
    }
    socket.user = decoded;
    next();
  } catch (err) {
    next(err, false);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.message;
    const aiIsPresentInMessage = message.includes("@ai");
    try {
      const project = await Project.findById(socket.project._id);

      if (project) {
        const newMessage = {
          sender: data.sender,
          message: data.message,
        };

        project.messages.push(newMessage);
        await project.save();

        // Broadcast the new message to other clients
        socket.broadcast.to(socket.roomId).emit("project-message", newMessage);
        if (aiIsPresentInMessage) {
          const prompt = message.replace("@ai", "");

          const result = await generateResult(prompt);

          io.to(socket.roomId).emit("project-message", {
            message: result,
            sender: "PromptCoder",
          });
        }
      }
    } catch (error) {
      console.error("Error saving message to project:", error);
    }
  });
  socket.on("disconnect", () => {
    socket.leave(socket.roomId);
  });
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

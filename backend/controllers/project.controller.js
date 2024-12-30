import { createProject, addCollaborator } from "../services/project.service.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";
export const createProjectController = async (req, res) => {
  const { name } = req.body;

  const currentUser = await User.findOne({ email: req.user.email });
  const userId = currentUser._id;

  try {
    const project = await createProject({ name, userId });
    return res.status(201).json({
      success: true,
      project,
      message: "Project created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Project name already exists`,
      });
    }
    return res.status(500).json({ message: error.message });
  }
};
export const getAllProjectController = async (req, res) => {
  try {
    const currentUser = await User.findOne({ email: req.user.email });
    const userId = currentUser._id;

    const projects = await Project.find({ users: { $in: [userId] } });
    return res.status(200).json({
      success: true,
      projects,
      message: "Projects retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const addCollaboratorController = async (req, res) => {
  const { projectId, collaboratorId } = req.body;

  const currentUser = await User.findOne({ email: req.user.email });
  const userId = currentUser._id;

  try {
    const project = await addCollaborator({
      projectId,
      userId,
      collaboratorId,
    });
    return res.status(201).json({
      success: true,
      project,
      message: "Collaborator added successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Project not found`,
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

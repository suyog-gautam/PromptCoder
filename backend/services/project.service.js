import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("UserId is required");
  }
  const project = await Project.create({ name, users: [userId] });
  return project;
};
export const addCollaborator = async ({
  projectId,
  userId,
  collaboratorId,
}) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }
  if (!userId) {
    throw new Error("UserId is required");
  }
  if (!collaboratorId) {
    throw new Error("CollaboratorId is required");
  }
  if (!mongoose.isValidObjectId(collaboratorId)) {
    throw new Error("Invalid Collaborator ID");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  // Find the project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Check if the userId exists in the users array
  const isUserAuthorized = project.users.some(
    (user) => user.toString() === userId.toString()
  );
  if (!isUserAuthorized) {
    throw new Error(
      "You are not authorized to add collaborators to this project"
    );
  }

  // Check if collaboratorId is already in the users array
  const isCollaboratorAlreadyAdded = project.users.some(
    (user) => user.toString() === collaboratorId.toString()
  );
  if (isCollaboratorAlreadyAdded) {
    throw new Error("Collaborator is already part of this project");
  }

  // Add the collaboratorId to the users array
  project.users.push(collaboratorId);
  await project.save();

  return project;
};

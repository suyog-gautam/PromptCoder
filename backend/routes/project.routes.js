import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { authUser } from "../middleware/authUser.js";
const projectRouter = Router();

projectRouter.post(
  "/create",
  authUser,
  projectController.createProjectController
);

projectRouter.get(
  "/getAll",
  authUser,
  projectController.getAllProjectController
);
projectRouter.put(
  "/addCollaborator",
  authUser,
  projectController.addCollaboratorController
);
projectRouter.get(
  "/getProject/:projectId",
  authUser,
  projectController.getProjecByIdController
);
projectRouter.get(
  "/getProjectMessages/:projectId",
  authUser,
  projectController.getProjectMessagesController
);
export { projectRouter };

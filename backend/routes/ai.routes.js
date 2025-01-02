import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";
const aiRouter = Router();

aiRouter.get("/getResult", aiController.generateResultController);

export { aiRouter };

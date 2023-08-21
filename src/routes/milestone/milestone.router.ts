import express, {Express, Router} from "express";
import { createMilestone, deleteMilestone, updateMilestone, viewCertainMilestone, viewMilestone } from "./milestone.controller";
import { validation } from "../../middlewares/validationMiddleware";
import {adminAuth, staffAuth, authorize} from "../../utils/requireAuth";
import { createMilestoneSchema } from '../../validations/milestoneValidation';
const milestoneRouter: Router = express.Router()

milestoneRouter.post("/milestone", validation(createMilestoneSchema), authorize, staffAuth, createMilestone)
milestoneRouter.get("/milestone", authorize, staffAuth, viewMilestone)
milestoneRouter.get("/milestone/:milestone_id", authorize, staffAuth, viewCertainMilestone)
milestoneRouter.put("/milestone/:milestone_id", validation(createMilestoneSchema), authorize, adminAuth, updateMilestone)
milestoneRouter.delete("/milestone/:milestone_id", authorize, adminAuth, deleteMilestone)

export default milestoneRouter
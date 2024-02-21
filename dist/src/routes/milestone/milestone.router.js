"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const milestone_controller_1 = require("./milestone.controller");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const requireAuth_1 = require("../../utils/requireAuth");
const milestoneValidation_1 = require("../../validations/milestoneValidation");
const milestoneRouter = express_1.default.Router();
milestoneRouter.post("/milestone", (0, validationMiddleware_1.validation)(milestoneValidation_1.createMilestoneSchema), requireAuth_1.authorize, requireAuth_1.staffAuth, milestone_controller_1.createMilestone);
milestoneRouter.get("/milestone", requireAuth_1.authorize, requireAuth_1.staffAuth, milestone_controller_1.viewMilestone);
milestoneRouter.get("/milestone/:milestone_id", requireAuth_1.authorize, requireAuth_1.staffAuth, milestone_controller_1.viewCertainMilestone);
milestoneRouter.put("/milestone/:milestone_id", (0, validationMiddleware_1.validation)(milestoneValidation_1.createMilestoneSchema), requireAuth_1.authorize, requireAuth_1.adminAuth, milestone_controller_1.updateMilestone);
milestoneRouter.delete("/milestone/:milestone_id", requireAuth_1.authorize, requireAuth_1.adminAuth, milestone_controller_1.deleteMilestone);
exports.default = milestoneRouter;

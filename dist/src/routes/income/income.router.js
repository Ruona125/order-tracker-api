"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const income_controller_1 = require("./income.controller");
const requireAuth_1 = require("../../utils/requireAuth");
const incomeValidation_1 = require("../../validations/incomeValidation");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const incomeRouter = express_1.default.Router();
incomeRouter.post("/income", (0, validationMiddleware_1.validation)(incomeValidation_1.createIncomeSchema), requireAuth_1.authorize, requireAuth_1.staffAuth, income_controller_1.createIncome);
incomeRouter.get("/income", requireAuth_1.authorize, requireAuth_1.staffAuth, income_controller_1.viewIncome);
incomeRouter.get("/income/:income_id", requireAuth_1.authorize, requireAuth_1.staffAuth, income_controller_1.viewCertainIncome);
incomeRouter.get("/income/total/:order_id", requireAuth_1.authorize, requireAuth_1.staffAuth, income_controller_1.viewTotalIncome);
incomeRouter.put("/income/:income_id", (0, validationMiddleware_1.validation)(incomeValidation_1.createIncomeSchema), requireAuth_1.authorize, requireAuth_1.adminAuth, income_controller_1.modifyIncome);
incomeRouter.delete("/income/:income_id", requireAuth_1.authorize, requireAuth_1.adminAuth, income_controller_1.deleteIncome);
exports.default = incomeRouter;

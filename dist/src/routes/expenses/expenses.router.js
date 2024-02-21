"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenses_controller_1 = require("./expenses.controller");
const requireAuth_1 = require("../../utils/requireAuth");
const expensesValidation_1 = require("../../validations/expensesValidation");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const expensesRouter = express_1.default.Router();
expensesRouter.post("/expenses", (0, validationMiddleware_1.validation)(expensesValidation_1.createExpenseSchema), requireAuth_1.authorize, requireAuth_1.staffAuth, expenses_controller_1.createExpenses);
expensesRouter.get("/expenses", requireAuth_1.authorize, requireAuth_1.staffAuth, expenses_controller_1.viewExpenses);
expensesRouter.get("/expenses/:expenses_id", requireAuth_1.authorize, requireAuth_1.staffAuth, expenses_controller_1.viewCertainExpenses);
expensesRouter.get("/expenses/total/:order_id", requireAuth_1.authorize, requireAuth_1.staffAuth, expenses_controller_1.viewTotalExpenses);
expensesRouter.put("/expenses/:expenses_id", (0, validationMiddleware_1.validation)(expensesValidation_1.createExpenseSchema), requireAuth_1.authorize, requireAuth_1.adminAuth, expenses_controller_1.modifyExpenses);
expensesRouter.delete("/expenses/:expenses_id", requireAuth_1.authorize, requireAuth_1.adminAuth, expenses_controller_1.deleteExpenses);
exports.default = expensesRouter;

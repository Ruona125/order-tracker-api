import express, {Express, Router} from "express";
import { createExpenses, viewCertainExpenses, viewExpenses, modifyExpenses, deleteExpenses, viewTotalExpenses } from "./expenses.controller";
import { adminAuth, staffAuth, authorize } from "../../utils/requireAuth";
import { createExpenseSchema } from '../../validations/expensesValidation';
import { validation } from "../../middlewares/validationMiddleware";
const expensesRouter: Router = express.Router();

expensesRouter.post("/expenses", validation(createExpenseSchema), authorize, staffAuth, createExpenses)
expensesRouter.get("/expenses", authorize, staffAuth, viewExpenses)
expensesRouter.get("/expenses/:expenses_id", authorize, staffAuth, viewCertainExpenses)
expensesRouter.get("/expenses/total/:order_id", authorize, staffAuth, viewTotalExpenses)
expensesRouter.put("/expenses/:expenses_id", validation(createExpenseSchema), authorize, adminAuth, modifyExpenses)
expensesRouter.delete("/expenses/:expenses_id", authorize, adminAuth, deleteExpenses)

export default expensesRouter
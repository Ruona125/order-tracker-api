import express, {Express, Router} from "express";
import { createIncome, viewCertainIncome, viewIncome, modifyIncome, deleteIncome, viewTotalIncome } from "./income.controller";
import {adminAuth, staffAuth, authorize} from "../../utils/requireAuth";
import { createIncomeSchema } from "../../validations/incomeValidation";
import { validation } from "../../middlewares/validationMiddleware";
const incomeRouter: Router = express.Router()

incomeRouter.post("/income", validation(createIncomeSchema), authorize, staffAuth, createIncome)
incomeRouter.get("/income", authorize, staffAuth, viewIncome)
incomeRouter.get("/income/:income_id", authorize, staffAuth, viewCertainIncome)
incomeRouter.get("/income/total/:order_id", authorize, staffAuth, viewTotalIncome)
incomeRouter.put("/income/:income_id", validation(createIncomeSchema), authorize, adminAuth, modifyIncome)
incomeRouter.delete("/income/:income_id", authorize, adminAuth, deleteIncome)

export default incomeRouter 
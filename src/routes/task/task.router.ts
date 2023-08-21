import express, {Express, Router} from "express";
import { createTask, ViewTasks, viewCertainTask, modifyTask, deleteTask, viewCertainTaskAdmin, completeTask, pendingTask } from "./task.controller";
import {adminAuth, verifyCertainToken, authorize} from "../../utils/requireAuth";
import { validation } from "../../middlewares/validationMiddleware";
import { taskValidationSchema } from "../../validations/taskValidation";
const taskRouter: Router = express.Router()

taskRouter.post("/task", validation(taskValidationSchema), authorize, adminAuth, createTask)
taskRouter.get("/task", authorize, adminAuth, ViewTasks)
taskRouter.get("/task/complete", authorize, adminAuth, completeTask)
taskRouter.get("/task/pending", authorize, adminAuth, pendingTask)
taskRouter.get("/view/task/:user_id", authorize, verifyCertainToken,viewCertainTask)
taskRouter.get("/task/:task_id", authorize, adminAuth,viewCertainTaskAdmin)
taskRouter.put("/task/:task_id", validation(taskValidationSchema), authorize, adminAuth, modifyTask)
taskRouter.delete("/task/:task_id", authorize, adminAuth, deleteTask)

export default taskRouter 
import express, {Express, Router } from "express";
import { login, logout, test } from "./login.controller";
import { loginSchema } from "../../validations/loginValidation";
import { validation } from "../../middlewares/validationMiddleware";

const signinRouter: Router = express.Router()

signinRouter.post("/user/login", validation(loginSchema), login)
signinRouter.post("/user/logout", logout)
signinRouter.get("/", test)
export default signinRouter; 
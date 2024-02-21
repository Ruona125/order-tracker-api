import express, { Express, Router } from "express";
import {registerUser, registerAdmin, getRegisteredUsers, getCertainRegisteredUser, deleteRegisteredUser} from "./register.controller";
import {authorize, adminAuth} from "../../utils/requireAuth"

import { validation } from "../../middlewares/validationMiddleware";
import { userSchema } from "../../validations/userValidation";

const registerUserRouter: Router = express.Router();

registerUserRouter.post("/user/register", validation(userSchema), registerUser);
registerUserRouter.post("/user/register/admin", validation(userSchema), registerAdmin);
registerUserRouter.get("/user/register", authorize, adminAuth,  getRegisteredUsers);
registerUserRouter.get("/user/register/:user_id", authorize, adminAuth,  getCertainRegisteredUser);
registerUserRouter.delete("/user/register/:user_id", authorize, adminAuth, deleteRegisteredUser)

export default registerUserRouter; 
  
  
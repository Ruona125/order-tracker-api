import express, { Express, Router } from "express";
import {
  changePassword,
  resetPassword,
  //  forgotPassword
} from "./users.controller";
import { authorize, verifyPostCertainToken } from "../../utils/requireAuth";

const changePasswordRouter: Router = express.Router();

changePasswordRouter.post(
  "/update/password",
  authorize,
  verifyPostCertainToken,
  changePassword
);
changePasswordRouter.post("/reset/password/", resetPassword);
// changePasswordRouter.post("/forgotpassword", forgotPassword)

export default changePasswordRouter;

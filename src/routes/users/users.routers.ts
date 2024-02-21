import express, { Express, Router } from "express";
import {
  changePassword,
  resetPassword,
  //  forgotPassword
  test
} from "./users.controller";
import { authorize, verifyPostCertainToken } from "../../utils/requireAuth";

const changePasswordRouter: Router = express.Router();

changePasswordRouter.get("/test", test)

changePasswordRouter.post(
  "/update/password",
  authorize,
  verifyPostCertainToken,
  changePassword
);
changePasswordRouter.post("/reset/password/", resetPassword);
// changePasswordRouter.post("/forgotpassword", forgotPassword)

export default changePasswordRouter;

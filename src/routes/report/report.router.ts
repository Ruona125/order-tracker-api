import express, {Express, Router} from "express";
import { reports } from "./report.controller";
import { staffAuth, authorize } from "../../utils/requireAuth";

const reportRouter: Router = express.Router();

reportRouter.get("/report", authorize, staffAuth, reports)

export default reportRouter;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("./report.controller");
const requireAuth_1 = require("../../utils/requireAuth");
const reportRouter = express_1.default.Router();
reportRouter.get("/report", requireAuth_1.authorize, requireAuth_1.staffAuth, report_controller_1.reports);
exports.default = reportRouter;

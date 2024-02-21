"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const requireAuth_1 = require("../../utils/requireAuth");
const changePasswordRouter = express_1.default.Router();
changePasswordRouter.get("/test", users_controller_1.test);
changePasswordRouter.post("/update/password", requireAuth_1.authorize, requireAuth_1.verifyPostCertainToken, users_controller_1.changePassword);
changePasswordRouter.post("/reset/password/", users_controller_1.resetPassword);
// changePasswordRouter.post("/forgotpassword", forgotPassword)
exports.default = changePasswordRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_controller_1 = require("./login.controller");
const loginValidation_1 = require("../../validations/loginValidation");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const signinRouter = express_1.default.Router();
signinRouter.post("/user/login", (0, validationMiddleware_1.validation)(loginValidation_1.loginSchema), login_controller_1.login);
signinRouter.post("/user/logout", login_controller_1.logout);
signinRouter.get("/", login_controller_1.test);
exports.default = signinRouter;

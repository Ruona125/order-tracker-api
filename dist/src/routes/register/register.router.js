"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_controller_1 = require("./register.controller");
const requireAuth_1 = require("../../utils/requireAuth");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const userValidation_1 = require("../../validations/userValidation");
const registerUserRouter = express_1.default.Router();
registerUserRouter.post("/user/register", (0, validationMiddleware_1.validation)(userValidation_1.userSchema), register_controller_1.registerUser);
registerUserRouter.post("/user/register/admin", (0, validationMiddleware_1.validation)(userValidation_1.userSchema), register_controller_1.registerAdmin);
registerUserRouter.get("/user/register", requireAuth_1.authorize, requireAuth_1.adminAuth, register_controller_1.getRegisteredUsers);
registerUserRouter.get("/user/register/:user_id", requireAuth_1.authorize, requireAuth_1.adminAuth, register_controller_1.getCertainRegisteredUser);
registerUserRouter.delete("/user/register/:user_id", requireAuth_1.authorize, requireAuth_1.adminAuth, register_controller_1.deleteRegisteredUser);
exports.default = registerUserRouter;

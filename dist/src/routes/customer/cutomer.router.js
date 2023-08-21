"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("./customer.controller");
const requireAuth_1 = require("../../utils/requireAuth");
const customerRouter = express_1.default.Router();
customerRouter.post("/customer", requireAuth_1.authorize, requireAuth_1.staffAuth, customer_controller_1.createCustomer);
customerRouter.get("/customer", requireAuth_1.authorize, requireAuth_1.staffAuth, customer_controller_1.getCustomers);
customerRouter.get("/customer/:customer_id", requireAuth_1.authorize, requireAuth_1.staffAuth, customer_controller_1.getCertainCustomer);
customerRouter.put("/customer/:customer_id", requireAuth_1.authorize, requireAuth_1.adminAuth, customer_controller_1.modifyCustomer);
customerRouter.delete("/customer/:customer_id", requireAuth_1.authorize, requireAuth_1.adminAuth, customer_controller_1.deleteCustomer);
exports.default = customerRouter;

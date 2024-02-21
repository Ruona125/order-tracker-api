"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const requireAuth_1 = require("../../utils/requireAuth");
const orderValidation_1 = require("../../validations/orderValidation");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const orderRouter = express_1.default.Router();
orderRouter.post("/order", requireAuth_1.authorize, (0, validationMiddleware_1.validation)(orderValidation_1.createOrderSchema), requireAuth_1.staffAuth, order_controller_1.createOrder);
orderRouter.get("/order", requireAuth_1.authorize, requireAuth_1.staffAuth, order_controller_1.viewOrder);
orderRouter.get("/order/:order_id", requireAuth_1.authorize, requireAuth_1.staffAuth, order_controller_1.viewCertainOrder);
orderRouter.get("/order-url/:order_id", order_controller_1.orderUrl);
orderRouter.get("/order/ongoing/order/", requireAuth_1.authorize, requireAuth_1.staffAuth, order_controller_1.ongoingOrder);
// orderRouter.get("/order/total/:customer_id", staffAuth, viewTotalOrder)
orderRouter.put("/order/:order_id", (0, validationMiddleware_1.validation)(orderValidation_1.createOrderSchema), requireAuth_1.authorize, requireAuth_1.adminAuth, order_controller_1.modifyOrder);
orderRouter.delete("/order/:order_id", requireAuth_1.authorize, requireAuth_1.adminAuth, order_controller_1.deleteOrder);
exports.default = orderRouter;

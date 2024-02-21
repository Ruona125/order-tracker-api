import express, {Express, Router} from "express";
import { createOrder, viewOrder, viewCertainOrder, modifyOrder, deleteOrder,  orderUrl, ongoingOrder } from "./order.controller";
import {adminAuth, staffAuth, authorize} from "../../utils/requireAuth";
import { createOrderSchema } from "../../validations/orderValidation";
import {validation} from "../../middlewares/validationMiddleware"
const orderRouter: Router = express.Router()


orderRouter.post("/order", authorize, validation(createOrderSchema), staffAuth, createOrder);
orderRouter.get("/order", authorize, staffAuth, viewOrder)
orderRouter.get("/order/:order_id", authorize, staffAuth, viewCertainOrder)
orderRouter.get("/order-url/:order_id", orderUrl)
orderRouter.get("/order/ongoing/order/", authorize, staffAuth, ongoingOrder)
// orderRouter.get("/order/total/:customer_id", staffAuth, viewTotalOrder)
orderRouter.put("/order/:order_id", validation(createOrderSchema), authorize, adminAuth, modifyOrder)
orderRouter.delete("/order/:order_id", authorize, adminAuth, deleteOrder)

export default orderRouter
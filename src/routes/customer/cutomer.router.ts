import express, {Express, Router} from "express";
import { modifyCustomer, deleteCustomer,getCertainCustomer, getCustomers, createCustomer } from "./customer.controller";
import {adminAuth, staffAuth, authorize} from "../../utils/requireAuth";
const customerRouter: Router = express.Router()

customerRouter.post("/customer", authorize, staffAuth, createCustomer)
customerRouter.get("/customer", authorize, staffAuth, getCustomers)
customerRouter.get("/customer/:customer_id", authorize, staffAuth, getCertainCustomer)
customerRouter.put("/customer/:customer_id", authorize, adminAuth, modifyCustomer)
customerRouter.delete("/customer/:customer_id", authorize, adminAuth, deleteCustomer)

export default customerRouter
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.modifyOrder = exports.orderUrl = exports.viewCertainOrder = exports.ongoingOrder = exports.viewOrder = exports.createOrder = void 0;
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("../../utils/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { details, cost_of_order, start_date, end_date, status, order_number, customer_id, } = req.body;
        try {
            const todayDate = new Date().toISOString().slice(0, 10);
            if (todayDate <= start_date && start_date <= end_date) {
                yield (0, database_1.default)("orders").insert({
                    order_id: (0, crypto_1.randomBytes)(4).toString("hex"),
                    details,
                    cost_of_order,
                    start_date,
                    end_date,
                    status,
                    order_number,
                    customer_id,
                });
                res.status(200).json({ message: "order created!!!" });
            }
            else {
                res.status(400).json({ message: "wrong date" });
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: "error creating order" });
        }
    });
}
exports.createOrder = createOrder;
function viewOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const orders = yield database_1.default.select(database_1.default.raw("o.order_id, o.order_number, o.details, o.cost_of_order, o.start_date, o.end_date, o.status, c.full_name, c.customer_id FROM orders AS o INNER JOIN customer AS c ON o.customer_id = c.customer_id"));
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        return res.status(200).json(orders);
    });
}
exports.viewOrder = viewOrder;
function ongoingOrder(req, res) {
    const { order_id } = req.params;
    database_1.default.select(database_1.default.raw(`o.customer_id,
      o.order_id,
      o.order_number,
      o.cost_of_order,
      o.details,
      o.start_date,
      o.end_date,
      o.status,
      c.full_name,
      c.phone_number,
      c.location,
      i.income_amount,
      COALESCE(e.expenses_amount, 0) AS expenses_amount,
      m.milestone_status,
      m.description,
      m.countdown_timer,
      (o.cost_of_order - COALESCE(i.income_amount, 0)) AS outstanding_balance
    FROM
      orders AS o
      INNER JOIN customer AS c ON c.customer_id = o.customer_id
      INNER JOIN milestone AS m ON m.order_id = o.order_id
      LEFT JOIN (
        SELECT order_id, SUM(amount) AS income_amount
        FROM income
        GROUP BY order_id
      ) AS i ON i.order_id = o.order_id
      LEFT JOIN (
        SELECT order_id, SUM(amount) AS expenses_amount
        FROM expenses
        GROUP BY order_id
      ) AS e ON e.order_id = o.order_id
    ORDER BY
      m.countdown_timer ASC`))
        .then((orders) => res.status(200).json(orders))
        .catch((err) => res.status(400).json("error getting orders"));
}
exports.ongoingOrder = ongoingOrder;
function viewCertainOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { order_id } = req.params;
        const orders = yield database_1.default
            .select(database_1.default.raw("o.order_id, o.order_number, o.details, o.cost_of_order, o.start_date, o.end_date, o.status, c.full_name, c.customer_id"))
            .from("orders AS o")
            .join("customer AS c", "o.customer_id", "=", "c.customer_id")
            .where({ "o.order_id": order_id });
        if (!orders) {
            return res.status(404).json({ message: "No orders found!!!" });
        }
        return res.status(200).json(orders);
    });
}
exports.viewCertainOrder = viewCertainOrder;
function orderUrl(req, res) {
    const { order_id } = req.params;
    database_1.default.select("*")
        .from("orders")
        .where({ order_id })
        .then((order) => {
        if (order.length) {
            return res.json(order[0]);
        }
        else {
            return res.status(404).json({ message: "order not found" });
        }
    });
}
exports.orderUrl = orderUrl;
function modifyOrder(req, res) {
    const { order_id } = req.params;
    const { details, cost_of_order, start_date, end_date, status, order_number,
    // milestone_description,
     } = req.body;
    (0, database_1.default)("orders")
        .where({ order_id })
        .update({
        details,
        cost_of_order,
        start_date,
        end_date,
        status,
        order_number,
    })
        .then((resp) => {
        if (resp) {
            res.json("success");
        }
        else {
            res.status(400).json({ message: "error updating order" });
        }
    })
        .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err });
    });
}
exports.modifyOrder = modifyOrder;
function deleteOrder(req, res) {
    const { order_id } = req.params;
    (0, database_1.default)("orders")
        .where({ order_id })
        .del()
        .then(() => {
        res.json("order deleted");
    })
        .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err });
    });
}
exports.deleteOrder = deleteOrder;

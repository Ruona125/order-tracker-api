"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reports = void 0;
const database_1 = __importDefault(require("../../utils/database"));
function reports(req, res) {
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
      (o.cost_of_order - COALESCE(i.income_amount, 0)) AS outstanding_balance,
      (i.income_amount - COALESCE(e.expenses_amount, 0)) AS gross_profit
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
        .then((report) => res.status(200).json(report))
        .catch((err) => res.status(400).json("error getting reports"));
}
exports.reports = reports;

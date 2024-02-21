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
exports.deleteIncome = exports.modifyIncome = exports.viewCertainIncome = exports.viewTotalIncome = exports.viewIncome = exports.createIncome = void 0;
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("../../utils/database"));
function createIncome(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { amount, description, name_of_income, date, order_id, } = req.body;
        try {
            yield (0, database_1.default)("income").insert({
                income_id: (0, crypto_1.randomBytes)(4).toString("hex"),
                amount,
                description,
                name_of_income,
                date,
                order_id,
            });
            res.status(200).json({ message: "income created" });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: "error creating income" });
        }
    });
}
exports.createIncome = createIncome;
function viewIncome(req, res) {
    database_1.default.select(database_1.default.raw("i.income_id, i.ref_no, i.amount, i.description, i.name_of_income, i.date, i.order_id, o.order_number, o.cost_of_order, c.full_name from income as i inner join orders as o on i.order_id=o.order_id INNER JOIN customer AS c ON o.customer_id = c.customer_id"))
        .then((income) => res.status(200).json(income))
        .catch((err) => res.status(400).json({ message: "error getting income" }));
}
exports.viewIncome = viewIncome;
function viewTotalIncome(req, res) {
    const { order_id } = req.params;
    try {
        database_1.default.raw(
        // `SELECT *, SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS total_income FROM income WHERE order_id = ?`,
        `SELECT *,
      SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS total_income,
      expected_amount - SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS balance
  FROM income
  WHERE order_id = ?
  
  `, [order_id]).then((income) => {
            if (income.rows.length) {
                return res.json(income.rows);
            }
            else {
                return res.status(400).json("finance not found");
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}
exports.viewTotalIncome = viewTotalIncome;
function viewCertainIncome(req, res) {
    const { income_id } = req.params;
    database_1.default.select("*")
        .from("income")
        .where({ income_id })
        .then((income) => {
        if (income.length) {
            return res.status(200).json(income[0]);
        }
        else {
            return res.status(404).json({ message: "income not found" });
        }
    })
        .catch((err) => {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "error getting income" });
    });
}
exports.viewCertainIncome = viewCertainIncome;
function modifyIncome(req, res) {
    const { income_id } = req.params;
    const { amount, description, name_of_income, date } = req.body;
    (0, database_1.default)("income")
        .where({ income_id })
        .update({ amount, description, name_of_income, date })
        .then((resp) => {
        if (resp) {
            res.json("success");
        }
        else {
            res.status(400).json({ message: "Error updating income" });
        }
    });
}
exports.modifyIncome = modifyIncome;
function deleteIncome(req, res) {
    const { income_id } = req.params;
    (0, database_1.default)("income")
        .where({ income_id })
        .del()
        .then(() => {
        res.json("income deleted");
    })
        .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err });
    });
}
exports.deleteIncome = deleteIncome;

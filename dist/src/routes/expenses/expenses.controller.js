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
exports.deleteExpenses = exports.modifyExpenses = exports.viewTotalExpenses = exports.viewCertainExpenses = exports.viewExpenses = exports.createExpenses = void 0;
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("../../utils/database"));
function createExpenses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { amount, description, name_of_expenses, date, order_id, } = req.body;
        try {
            yield (0, database_1.default)("expenses").insert({
                expenses_id: (0, crypto_1.randomBytes)(4).toString("hex"),
                amount,
                description,
                name_of_expenses,
                date,
                order_id,
            });
            res.status(200).json({ message: "Expenses Created" });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: "error creating Expenses" });
        }
    });
}
exports.createExpenses = createExpenses;
function viewExpenses(req, res) {
    database_1.default.select(database_1.default.raw("e.expenses_id, e.ref_no, e.amount, e.description, e.name_of_expenses, e.date, e.order_id, o.cost_of_order, o.order_number, c.full_name FROM expenses AS e INNER JOIN orders AS o ON e.order_id = o.order_id INNER JOIN customer AS c ON o.customer_id = c.customer_id"))
        .then((Expenses) => res.status(200).json(Expenses))
        .catch((err) => res.status(400).json({ message: "error getting Expenses" }));
}
exports.viewExpenses = viewExpenses;
function viewCertainExpenses(req, res) {
    const { expenses_id } = req.params;
    database_1.default.select("*")
        .from("expenses")
        .where({ expenses_id })
        .then((Expenses) => {
        if (Expenses.length) {
            return res.json(Expenses[0]);
        }
        else {
            return res.status(404).json({ message: "Expenses not found" });
        }
    })
        .catch((err) => res.status(400).json({ message: "error getting Expenses" }));
}
exports.viewCertainExpenses = viewCertainExpenses;
function viewTotalExpenses(req, res) {
    const { order_id } = req.params;
    try {
        database_1.default.raw(`SELECT *,
        SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS total_income,
        expected_amount - SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS balance
    FROM expenses
    WHERE order_id = ?`, [order_id]).then((expenses) => {
            if (expenses.rows.length) {
                return res.json(expenses.rows);
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
exports.viewTotalExpenses = viewTotalExpenses;
function modifyExpenses(req, res) {
    const { expenses_id } = req.params;
    const { amount, description, name_of_expenses, date } = req.body;
    (0, database_1.default)("expenses")
        .where({ expenses_id })
        .update({ amount, description, name_of_expenses, date })
        .then((resp) => {
        if (resp) {
            res.json("success");
        }
        else {
            res.status(400).json({ message: "Error updating Expenses" });
        }
    });
}
exports.modifyExpenses = modifyExpenses;
function deleteExpenses(req, res) {
    const { expenses_id } = req.params;
    (0, database_1.default)("expenses")
        .where({ expenses_id })
        .del()
        .then(() => {
        res.json("Expenses deleted");
    })
        .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err });
    });
}
exports.deleteExpenses = deleteExpenses;

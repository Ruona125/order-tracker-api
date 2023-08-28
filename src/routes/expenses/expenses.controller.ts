import { Request, Response } from "express";
import { randomBytes } from "crypto";
import db from "../../utils/database";

export async function createExpenses(req: Request, res: Response) {
  const {
    amount,
    description,
    name_of_expenses,
    date,
    order_id,
  } = req.body;
  try {
    await db("expenses").insert({
      expenses_id: randomBytes(4).toString("hex"),
      amount,
      description,
      name_of_expenses,
      date,
      order_id,
    });
    res.status(200).json({ message: "Expenses Created" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error creating Expenses" });
  }
}

export function viewExpenses(req: Request, res: Response) {
  db.select(
    db.raw(
      "e.expenses_id, e.ref_no, e.amount, e.description, e.name_of_expenses, e.date, e.order_id, o.cost_of_order, o.order_number, c.full_name FROM expenses AS e INNER JOIN orders AS o ON e.order_id = o.order_id INNER JOIN customer AS c ON o.customer_id = c.customer_id"
    )
  )
    .then((Expenses) => res.status(200).json(Expenses))
    .catch((err) =>
      res.status(400).json({ message: "error getting Expenses" })
    );
}

export function viewCertainExpenses(req: Request, res: Response) {
  const { expenses_id } = req.params;
  db.select("*")
    .from("expenses")
    .where({ expenses_id })
    .then((Expenses) => {
      if (Expenses.length) {
        return res.json(Expenses[0]);
      } else {
        return res.status(404).json({ message: "Expenses not found" });
      }
    })
    .catch((err) =>
      res.status(400).json({ message: "error getting Expenses" })
    );
}

export function viewTotalExpenses(req: Request, res: Response) {
  const { order_id } = req.params;
  try {
    db.raw(
      `SELECT *,
        SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS total_income,
        expected_amount - SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS balance
    FROM expenses
    WHERE order_id = ?`,
      [order_id]
    ).then((expenses) => {
      if (expenses.rows.length) {
        return res.json(expenses.rows);
      } else {
        return res.status(400).json("finance not found");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export function modifyExpenses(req: Request, res: Response) {
  const { expenses_id } = req.params;
  const { amount, description, name_of_expenses, date } =
    req.body;
  db("expenses")
    .where({ expenses_id })
    .update({ amount, description, name_of_expenses, date })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json({ message: "Error updating Expenses" });
      }
    });
}

export function deleteExpenses(req: Request, res: Response) {
  const { expenses_id } = req.params;
  db("expenses")
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

import { Request, Response } from "express";
import { randomBytes } from "crypto";
import db from "../../utils/database";

export async function createIncome(req: Request, res: Response) {
  const {
    amount,
    description,
    name_of_income,
    date,
    order_id,
  } = req.body;
  try {
    await db("income").insert({
      income_id: randomBytes(4).toString("hex"),
      amount,
      description,
      name_of_income,
      date,
      order_id,
    });
    res.status(200).json({ message: "income created" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error creating income" });
  }
}

export function viewIncome(req: Request, res: Response) {
  db.select(
    db.raw(
      "i.income_id, i.ref_no, i.amount, i.description, i.name_of_income, i.date, i.order_id, o.order_number, o.cost_of_order, c.full_name from income as i inner join orders as o on i.order_id=o.order_id INNER JOIN customer AS c ON o.customer_id = c.customer_id"
    )
  )
    .then((income) => res.status(200).json(income))
    .catch((err) => res.status(400).json({ message: "error getting income" }));
}

export function viewTotalIncome(req: Request, res: Response) {
  const { order_id } = req.params;
  try {
    db.raw(
      // `SELECT *, SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS total_income FROM income WHERE order_id = ?`,
      `SELECT *,
      SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS total_income,
      expected_amount - SUM(cast(amount as integer)) OVER (PARTITION BY order_id) AS balance
  FROM income
  WHERE order_id = ?
  
  `,
      [order_id]
    ).then((income) => {
      if (income.rows.length) {
        return res.json(income.rows);
      } else {
        return res.status(400).json("finance not found");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export function viewCertainIncome(req: Request, res: Response) {
  const { income_id } = req.params;
  db.select("*")
    .from("income")
    .where({ income_id })
    .then((income) => {
      if (income.length) {
        return res.status(200).json(income[0]);
      } else {
        return res.status(404).json({ message: "income not found" });
      }
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: "error getting income" });
    });
}



export function modifyIncome(req: Request, res: Response) {
  const { income_id } = req.params;
  const { amount, description, name_of_income, date } =
    req.body;
  db("income")
    .where({ income_id }) 
    .update({ amount, description, name_of_income, date })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json({ message: "Error updating income" });
      }
    });
}

export function deleteIncome(req: Request, res: Response) {
  const { income_id } = req.params;
  db("income")
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

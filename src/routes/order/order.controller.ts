import { Request, Response } from "express";
import { randomBytes } from "crypto";
import db from "../../utils/database";
import dotenv from "dotenv";
dotenv.config();

export async function createOrder(req: Request, res: Response) {
  const {
    details,
    cost_of_order,
    start_date,
    end_date,
    status,
    order_number,
    customer_id,
  } = req.body;

  try {
    const todayDate = new Date().toISOString().slice(0, 10);
    if (todayDate <= start_date && start_date <= end_date) {
      await db("orders").insert({
        order_id: randomBytes(4).toString("hex"),
        details,
        cost_of_order,
        start_date,
        end_date,
        status, 
        order_number,
        customer_id,
      });
      res.status(200).json({ message: "order created!!!" });
    } else {
      res.status(400).json({ message: "wrong date" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error creating order" });
  }
}

export async function viewOrder(req: Request, res: Response) {
  const orders = await db.select(
    db.raw(
      "o.order_id, o.order_number, o.details, o.cost_of_order, o.start_date, o.end_date, o.status, c.full_name, c.customer_id FROM orders AS o INNER JOIN customer AS c ON o.customer_id = c.customer_id"
    )
  );

  if (!orders) {
    return res.status(404).json({ message: "No orders found" });
  }

  return res.status(200).json(orders);
}

export function ongoingOrder(req: Request, res: Response) {
  const { order_id } = req.params;
  db.select(
    db.raw(
      `o.customer_id,
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
      m.countdown_timer ASC`
    )
  )
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(400).json("error getting orders"));
}

export async function viewCertainOrder(req: Request, res: Response) {
  const { order_id } = req.params;
  const orders = await db
    .select(
      db.raw(
        "o.order_id, o.order_number, o.details, o.cost_of_order, o.start_date, o.end_date, o.status, c.full_name, c.customer_id"
      )
    )
    .from("orders AS o")
    .join("customer AS c", "o.customer_id", "=", "c.customer_id")
    .where({ "o.order_id": order_id });
  if (!orders) {
    return res.status(404).json({ message: "No orders found!!!" });
  }

  return res.status(200).json(orders);
}

export function orderUrl(req: Request, res: Response) {
  const { order_id } = req.params;
  db.select("*")
    .from("orders")
    .where({ order_id })
    .then((order) => {
      if (order.length) {
        return res.json(order[0]);
      } else {
        return res.status(404).json({ message: "order not found" });
      }
    });
}

export function modifyOrder(req: Request, res: Response) {
  const { order_id } = req.params;
  const {
    details,
    cost_of_order,
    start_date,
    end_date,
    status,
    order_number,
    // milestone_description,
  } = req.body;
  db("orders")
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
      } else {
        res.status(400).json({ message: "error updating order" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err });
    });
}

export function deleteOrder(req: Request, res: Response) {
  const { order_id } = req.params;
  db("orders")
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

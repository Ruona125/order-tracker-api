import { Request, Response } from "express";
import { randomBytes } from "crypto";
import db from "../../utils/database";

export async function createCustomer(req: Request, res: Response) {
  const { full_name, phone_number, email, location } = req.body;
  try {
    await db("customer").insert({
      customer_id: randomBytes(4).toString("hex"),
      full_name,
      phone_number,
      email,
      location,
    });
    res.status(200).json({ message: "customer created successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error creating customer" });
  }
}

export function getCustomers(req: Request, res: Response) {
  db.select("*")
    .from("customer")
    .then((customer) => res.status(200).json(customer))
    .catch((err) =>
      res.status(400).json({ message: "error getting customer" })
    );
}

export function getCertainCustomer(req: Request, res: Response) {
  const { customer_id } = req.params;
  db.select("*")
    .from("customer")
    .where({ customer_id })
    .then((customer) => {
      if (customer.length) {
        return res.json(customer[0]);
      } else {
        return res.status(404).json({ message: "customer not found" });
      }
    })
    .catch((err) =>
      res.status(400).json({ message: "error getting customer" })
    );
}

export function deleteCustomer(req: Request, res: Response) {
  const { customer_id } = req.params;
  db("customer")
    .where({ customer_id })
    .del()
    .then(() => {
      res.json("customer deleted");
    })
    .catch((err) => res.status(400).json("error"));
}

export function modifyCustomer(req: Request, res: Response) {
  const { customer_id } = req.params;
  const { full_name, phone_number, email, location } = req.body;
  db("customer")
    .where({ customer_id })
    .update({ full_name, phone_number, email, location })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json("error updating customer details");
      }
    })
    .catch((err) => res.json("err"));
}

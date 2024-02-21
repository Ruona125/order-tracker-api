import bcrypt from "bcrypt";
import { Request, Response } from "express";
import db from "../../utils/database";
import { randomBytes } from "crypto";

export async function registerUser(req: Request, res: Response) {
  const { name, email, password, security_question, security_answer } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    // Insert into the database
    await db("users").insert({
      user_id: randomBytes(4).toString("hex"),
      name,
      password: passwordHash,
      email,
      roles: "staff",
      security_answer,
      security_question
    });
    res.status(200).json("User successfully created");
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating user" });
  }
}

export async function registerAdmin(req: Request, res: Response) {
  const { name, email, password, security_question, security_answer } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    // Insert into the database
    await db("users").insert({
      user_id: randomBytes(4).toString("hex"),
      name,
      password: passwordHash,
      email,
      roles: "admin",
      security_question, 
      security_answer
    });
    res.status(200).json("User successfully created");
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating user" });
  }
}

export function getRegisteredUsers(req: Request, res: Response) {
  db.select("*")
    .from("users")
    .where("roles", "staff")
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(400).json({ message: "error getting users" }));
}

export function getCertainRegisteredUser(req: Request, res: Response) {
  const { user_id } = req.params;
  db.select("*")
    .from("users")
    .where({ user_id })
    .then((user) => {
      if (user.length) {
        return res.json(user[0]);
      } else {
        return res.status(400).json("user not found");
      } 
    })
    .catch((err) => res.status(400).json({ message: "error getting users" }));
}

export function deleteRegisteredUser(req: Request, res: Response) {
  const { user_id } = req.params;
  db("users")
    .where({
      user_id,
    })
    .del()
    .then(() => {
      res.json("user deleted");
    })
    .catch((err) => res.status(400).json("error"));
}

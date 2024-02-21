import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../../utils/database";
import dotenv from 'dotenv';
dotenv.config();




export async function changePassword(req: Request, res: Response) {
  const { user_id, old_password, new_password, confirm_password } = req.body;
  try {
    const user = await db("users").where({ user_id }).first();
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    if (!(await bcrypt.compare(old_password, user.password))) {
      return res.status(400).json({ error: "old password is incorrect" });
    }
    if (new_password !== confirm_password) {
      return res
        .status(400)
        .json({ error: "new password and confirm password do not match" });
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db("users").where({ user_id }).update({ password: hashedPassword });
    return res.status(200).json({ message: "password reset successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const {
    email,
    security_question,
    security_answer,
    password,
    confirm_password,
  } = req.body;

  try {
    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    if (user.security_answer !== security_answer) {
      console.log("answer problem");
      return res
        .status(400)
        .json({ error: "incorrect security question answer" });
    }

    if (user.security_question !== security_question) {
      console.log("question problem");
      return res.status(400).json({ error: "incorrect security question" });
    }

    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db("users")
      .where({ user_id: user.user_id })
      .update({ password: hashedPassword });

    return res.status(200).json({ message: "password reset successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
}

export function test(req:Request, res: Response){
  res.send("worked")
}
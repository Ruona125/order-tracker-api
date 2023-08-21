import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../../utils/database";
import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const apiKey:any =process.env.API_KEY
sgMail.setApiKey(apiKey);

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

//this is the code to reset the password after they've recieved the mail
// export async function resetPassword(req: Request, res: Response) {
//   const { password, confirm_password } = req.body;
//   const { reset_token } = req.params;
//   if (!password) {
//     return res.status(400).json({ message: "token and password are required" });
//   }
//   try {
//     const user = await db("users").where({ reset_token: reset_token }).first();
//     if (!user) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     if (password !== confirm_password) {
//       res.status(400).json({ error: "Passwords don't match" });
//     }
//     const passwordHash = await bcrypt.hash(password, 10);
//     await db("users").where({ user_id: user.user_id }).update({
//       password: passwordHash,
//       reset_token: null,
//     });
//     res.json({ message: "Password reset successful" });
//   } catch (err) {
//     console.log(err);
//   }
// }

// export async function forgotPassword(req: Request, res: Response) {
//   const { email, to, html } = req.body;
//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }
//   try {
//     const user = await db("users").where({ email }).first();
//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }
//     const resetToken = jwt.sign({ userId: user.user_id }, JWT_SECRET);
//     await db("users")
//       .where({ user_id: user.user_id })
//       .update({ reset_token: resetToken });
//     const resetLink = `http://localhost:5173/reset/passwords/${resetToken}`;
//     // const resetLink = `http://localhost:5173/profile`;
//     console.log(`${resetLink}`);
//     const msg = {
//       to: email,
//       from: "meetruona@gmail.com",
//       subject: "reset password",
//       text: `here is the link to reset your password ${resetLink}`,
//       html: `<strong> here is the link to reset your password ${resetLink}</strong>`,
//     };
//     sgMail
//       .send(msg)
//       .then(() => {
//         res.status(200);
//       })
//       .catch((error) => console.log(error));
//     res.json({ message: "Reset Link sent" });
//   } catch (err) {
//     console.log(err);
//   }
// }

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

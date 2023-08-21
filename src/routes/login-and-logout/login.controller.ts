import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../../utils/database";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  //make sure the user input an email and password value
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    //find the user in the database
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: "invalid Login details" });
    }

    //check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "invalid Login details" });
    }

    //Generate a jwt token
    const token = jwt.sign(
      { userId: user.user_id, roles: user.roles },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    //This is to check if the user_id is stored in the token
    const decode:any = jwt.decode(token);
    // console.log(decode.roles);
    // console.log(decode.exp)

    //this is to insert the data into the sessions table
    await db("sessions").insert({
        user_id: user.user_id,
        token: token,
      }); 

    //return the user details with token.
    const userWithToken = { ...user, token };
    return res.status(200).json(userWithToken);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "error loggin in" });
  }
}

export async function logout(req: Request, res: Response) {
  const authToken = req.headers.authorization; 

  try { 
    // Delete the session record based on the token
    await db("sessions").where({ token: authToken }).del();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
}  

export function test(req: Request, res: Response){
  res.status(200).json("welcome!!!")
}
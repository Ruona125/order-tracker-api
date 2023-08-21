import { Request, Response, NextFunction } from "express";
export const validation =
  (schema:any) => async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
      await schema.validate(body);
      next();
    //   return next();
    } catch (err) {
      console.log(err);
      return res.status(400).json("error validating form");
    }
  };

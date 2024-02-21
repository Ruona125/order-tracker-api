import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  roles?: string;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function adminAuth(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, "your_secret_key");
    req.roles = decoded.roles;

    if (decoded.roles !== "admin") {
      return res.status(401).json("Unauthorized");
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function staffAuth(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, "your_secret_key");
    req.roles = decoded.roles;

    if (decoded.roles !== "staff" && decoded.roles !== "admin") {
      return res.status(401).json("Unauthorized");
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


export function authorize(req: Request, res: Response, next: NextFunction) {
  // Get the token from the request headers or query parameters
  const token = req.headers.authorization || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    // Verify and decode the token
    const decoded: any = jwt.verify(token as string, 'your_secret_key');

    // Check if the token has expired
    if (decoded.exp <= Date.now() / 1000) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    // Token is valid, proceed to the next middleware
    next();
  } catch (error) {
    // Token verification failed
    if ((error as Error).name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function verifyCertainToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, "your_secret_key");
    req.userId = decoded.userId;
    if (decoded.userId !== req.params.user_id) {
      return res.status(401).json("unauthorize");
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function verifyPostCertainToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, "your_secret_key");
    req.userId = decoded.userId;
    if (decoded.userId !== req.body.user_id) {
      return res.status(401).json("unauthorize");
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

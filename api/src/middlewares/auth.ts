import { NextFunction, Request, Response } from "express";
import { Role } from "../constants";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../utils/jwt";

export interface AuthUser {
  id: string;
  role: Role;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw ApiError.unauthorized();

    let payload;
    try {
      payload = verifyToken(header.slice(7));
    } catch {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    const user = await User.findById(payload.sub);
    if (!user) throw ApiError.unauthorized("Account no longer exists");

    req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    next();
  }
);

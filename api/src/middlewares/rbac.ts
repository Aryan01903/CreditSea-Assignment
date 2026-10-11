import { NextFunction, Request, RequestHandler, Response } from "express";
import { ROLES, Role } from "../constants";
import { ApiError } from "../utils/apiError";

export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (req.user.role === ROLES.ADMIN || roles.includes(req.user.role)) return next();
    next(ApiError.forbidden());
  };

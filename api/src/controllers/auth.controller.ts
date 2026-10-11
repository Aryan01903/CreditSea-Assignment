import { Request, Response } from "express";
import { ROLES } from "../constants";
import { User, UserDocument } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { signToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const serializeUser = (user: UserDocument) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  personalDetails: user.personalDetails ?? null,
  salarySlip: user.salarySlip ?? null,
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("An account with this email already exists");

  const user = await User.create({ name, email, password, role: ROLES.BORROWER });
  const token = signToken({ sub: user.id, role: user.role });

  res.status(201).json({ success: true, data: { token, user: serializeUser(user) } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signToken({ sub: user.id, role: user.role });

  res.json({ success: true, data: { token, user: serializeUser(user) } });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw ApiError.notFound("User not found");

  res.json({ success: true, data: { user: serializeUser(user) } });
});

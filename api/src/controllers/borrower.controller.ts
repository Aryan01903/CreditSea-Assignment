import { Request, Response } from "express";
import { LOAN_STATUS } from "../constants";
import { Loan } from "../models/loan.model";
import { Payment } from "../models/payment.model";
import { User } from "../models/user.model";
import { runBre } from "../services/bre.service";
import { computeLoan } from "../services/interest.service";
import { uploadToCloudinary } from "../services/upload.service";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { applyLoanSchema, personalDetailsSchema } from "../validators/borrower.validator";

export const savePersonalDetails = asyncHandler(async (req: Request, res: Response) => {
  const details = personalDetailsSchema.parse(req.body);

  const failures = runBre(details);
  if (failures.length > 0) {
    throw ApiError.unprocessable("You are not eligible for a loan", failures);
  }

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { personalDetails: details },
    { new: true }
  );
  if (!user) throw ApiError.notFound("User not found");

  res.json({ success: true, data: { personalDetails: user.personalDetails } });
});

export const uploadSlip = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("Salary slip file is required");

  const result = await uploadToCloudinary(req.file.buffer);
  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { salarySlip: result.secure_url },
    { new: true }
  );
  if (!user) throw ApiError.notFound("User not found");

  res.json({ success: true, data: { salarySlip: user.salarySlip } });
});

export const applyForLoan = asyncHandler(async (req: Request, res: Response) => {
  const { amount, tenureDays } = applyLoanSchema.parse(req.body);

  const user = await User.findById(req.user!.id);
  if (!user) throw ApiError.notFound("User not found");
  if (!user.personalDetails) {
    throw ApiError.badRequest("Complete your personal details before applying");
  }
  if (!user.salarySlip) {
    throw ApiError.badRequest("Upload your salary slip before applying");
  }

  const failures = runBre(user.personalDetails);
  if (failures.length > 0) {
    throw ApiError.unprocessable("You are not eligible for a loan", failures);
  }

  const activeLoan = await Loan.findOne({
    borrower: user.id,
    status: { $in: [LOAN_STATUS.APPLIED, LOAN_STATUS.SANCTIONED, LOAN_STATUS.DISBURSED] },
  });
  if (activeLoan) throw ApiError.conflict("You already have an active loan application");

  const computation = computeLoan(amount, tenureDays);
  const loan = await Loan.create({
    borrower: user.id,
    amount,
    tenureDays,
    salarySlip: user.salarySlip,
    ...computation,
  });

  res.status(201).json({ success: true, data: { loan } });
});

export const getMyLoans = asyncHandler(async (req: Request, res: Response) => {
  const loans = await Loan.find({ borrower: req.user!.id }).sort({ createdAt: -1 }).lean();
  const payments = await Payment.find({ loan: { $in: loans.map((loan) => loan._id) } })
    .sort({ paidAt: 1 })
    .lean();

  res.json({ success: true, data: { loans, payments } });
});

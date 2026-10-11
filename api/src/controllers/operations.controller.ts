import { Request, Response } from "express";
import { LOAN_STATUS, ROLES } from "../constants";
import { Loan } from "../models/loan.model";
import { Payment } from "../models/payment.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { recordPaymentSchema, sanctionDecisionSchema } from "../validators/operations.validator";

const BORROWER_FIELDS = "name email personalDetails";

export const getLeads = asyncHandler(async (_req: Request, res: Response) => {
  const borrowerIdsWithLoans = await Loan.distinct("borrower");
  const leads = await User.find({
    role: ROLES.BORROWER,
    _id: { $nin: borrowerIdsWithLoans },
  })
    .select("name email personalDetails salarySlip createdAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: { leads } });
});

export const getAppliedLoans = asyncHandler(async (_req: Request, res: Response) => {
  const loans = await Loan.find({ status: LOAN_STATUS.APPLIED })
    .populate("borrower", BORROWER_FIELDS)
    .sort({ createdAt: 1 })
    .lean();

  res.json({ success: true, data: { loans } });
});

export const decideLoan = asyncHandler(async (req: Request, res: Response) => {
  const decision = sanctionDecisionSchema.parse(req.body);

  const loan = await Loan.findById(req.params.id);
  if (!loan) throw ApiError.notFound("Loan not found");
  if (loan.status !== LOAN_STATUS.APPLIED) {
    throw ApiError.conflict(`Only applied loans can be reviewed (current status: ${loan.status})`);
  }

  if (decision.decision === "approve") {
    loan.status = LOAN_STATUS.SANCTIONED;
    loan.sanctionedBy = req.user!.id as never;
    loan.sanctionedAt = new Date();
  } else {
    loan.status = LOAN_STATUS.REJECTED;
    loan.rejectionReason = decision.reason;
  }
  await loan.save();
  await loan.populate("borrower", BORROWER_FIELDS);

  res.json({ success: true, data: { loan } });
});

export const getSanctionedLoans = asyncHandler(async (_req: Request, res: Response) => {
  const loans = await Loan.find({ status: LOAN_STATUS.SANCTIONED })
    .populate("borrower", BORROWER_FIELDS)
    .sort({ sanctionedAt: 1 })
    .lean();

  res.json({ success: true, data: { loans } });
});

export const disburseLoan = asyncHandler(async (req: Request, res: Response) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) throw ApiError.notFound("Loan not found");
  if (loan.status !== LOAN_STATUS.SANCTIONED) {
    throw ApiError.conflict(
      `Only sanctioned loans can be disbursed (current status: ${loan.status})`
    );
  }

  loan.status = LOAN_STATUS.DISBURSED;
  loan.disbursedBy = req.user!.id as never;
  loan.disbursedAt = new Date();
  await loan.save();
  await loan.populate("borrower", BORROWER_FIELDS);

  res.json({ success: true, data: { loan } });
});

export const getActiveLoans = asyncHandler(async (_req: Request, res: Response) => {
  const loans = await Loan.find({ status: { $in: [LOAN_STATUS.DISBURSED, LOAN_STATUS.CLOSED] } })
    .populate("borrower", BORROWER_FIELDS)
    .sort({ disbursedAt: 1 })
    .lean();

  res.json({ success: true, data: { loans } });
});

export const getLoanPayments = asyncHandler(async (req: Request, res: Response) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) throw ApiError.notFound("Loan not found");

  const payments = await Payment.find({ loan: loan.id }).sort({ paidAt: 1 }).lean();

  res.json({ success: true, data: { payments } });
});

export const recordPayment = asyncHandler(async (req: Request, res: Response) => {
  const { utr, amount, paidAt } = recordPaymentSchema.parse(req.body);

  const loan = await Loan.findById(req.params.id);
  if (!loan) throw ApiError.notFound("Loan not found");
  if (loan.status !== LOAN_STATUS.DISBURSED) {
    throw ApiError.conflict(
      `Payments can only be recorded on disbursed loans (current status: ${loan.status})`
    );
  }

  const outstanding = Math.round((loan.totalRepayment - loan.amountPaid) * 100) / 100;
  if (amount > outstanding) {
    throw ApiError.unprocessable(
      `Payment exceeds outstanding balance of ₹${outstanding.toLocaleString("en-IN")}`
    );
  }

  const duplicate = await Payment.findOne({ utr });
  if (duplicate) throw ApiError.conflict("A payment with this UTR already exists");

  const payment = await Payment.create({
    loan: loan.id,
    utr,
    amount,
    paidAt,
    recordedBy: req.user!.id,
  });

  loan.amountPaid = Math.round((loan.amountPaid + amount) * 100) / 100;
  if (loan.amountPaid >= loan.totalRepayment) {
    loan.status = LOAN_STATUS.CLOSED;
    loan.closedAt = new Date();
  }
  await loan.save();
  await loan.populate("borrower", BORROWER_FIELDS);

  res.status(201).json({ success: true, data: { loan, payment } });
});

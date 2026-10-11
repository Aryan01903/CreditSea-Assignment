import { Document, Schema, Types, model } from "mongoose";
import { LOAN_STATUS, LoanStatus } from "../constants";

export interface LoanDocument extends Document {
  borrower: Types.ObjectId;
  amount: number;
  tenureDays: number;
  interestRate: number;
  interest: number;
  totalRepayment: number;
  amountPaid: number;
  status: LoanStatus;
  salarySlip: string;
  rejectionReason?: string;
  sanctionedBy?: Types.ObjectId;
  sanctionedAt?: Date;
  disbursedBy?: Types.ObjectId;
  disbursedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const loanSchema = new Schema<LoanDocument>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    tenureDays: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    interest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(LOAN_STATUS),
      default: LOAN_STATUS.APPLIED,
      index: true,
    },
    salarySlip: { type: String, required: true },
    rejectionReason: { type: String },
    sanctionedBy: { type: Schema.Types.ObjectId, ref: "User" },
    sanctionedAt: { type: Date },
    disbursedBy: { type: Schema.Types.ObjectId, ref: "User" },
    disbursedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

export const Loan = model<LoanDocument>("Loan", loanSchema);

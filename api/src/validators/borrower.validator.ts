import { z } from "zod";
import { EMPLOYMENT_MODES, LOAN_LIMITS } from "../constants";

export const personalDetailsSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  pan: z.string().trim().toUpperCase().length(10, "PAN must be 10 characters"),
  dateOfBirth: z.coerce.date().max(new Date(), "Date of birth must be in the past"),
  monthlySalary: z.coerce.number().positive("Salary must be positive"),
  employmentMode: z.enum(EMPLOYMENT_MODES),
});

export const applyLoanSchema = z.object({
  amount: z.coerce
    .number()
    .min(LOAN_LIMITS.MIN_AMOUNT, `Minimum loan amount is ₹${LOAN_LIMITS.MIN_AMOUNT}`)
    .max(LOAN_LIMITS.MAX_AMOUNT, `Maximum loan amount is ₹${LOAN_LIMITS.MAX_AMOUNT}`),
  tenureDays: z.coerce
    .number()
    .int()
    .min(LOAN_LIMITS.MIN_TENURE_DAYS, `Minimum tenure is ${LOAN_LIMITS.MIN_TENURE_DAYS} days`)
    .max(LOAN_LIMITS.MAX_TENURE_DAYS, `Maximum tenure is ${LOAN_LIMITS.MAX_TENURE_DAYS} days`),
});

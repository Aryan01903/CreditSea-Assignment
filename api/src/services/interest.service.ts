import { LOAN_LIMITS } from "../constants";

export interface LoanComputation {
  interestRate: number;
  interest: number;
  totalRepayment: number;
}

export const computeLoan = (amount: number, tenureDays: number): LoanComputation => {
  const interest =
    Math.round(((amount * LOAN_LIMITS.INTEREST_RATE * tenureDays) / (365 * 100)) * 100) / 100;
  return {
    interestRate: LOAN_LIMITS.INTEREST_RATE,
    interest,
    totalRepayment: Math.round((amount + interest) * 100) / 100,
  };
};

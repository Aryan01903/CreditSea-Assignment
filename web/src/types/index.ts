export type Role = "admin" | "sales" | "sanction" | "disbursement" | "collection" | "borrower";

export type LoanStatus = "applied" | "sanctioned" | "rejected" | "disbursed" | "closed";

export type EmploymentMode = "salaried" | "self-employed" | "unemployed";

export interface PersonalDetails {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  personalDetails: PersonalDetails | null;
  salarySlip: string | null;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  personalDetails?: PersonalDetails;
  salarySlip?: string;
  createdAt: string;
}

export interface Borrower {
  _id: string;
  name: string;
  email: string;
  personalDetails?: PersonalDetails;
}

export interface Loan {
  _id: string;
  borrower: string | Borrower;
  amount: number;
  tenureDays: number;
  interestRate: number;
  interest: number;
  totalRepayment: number;
  amountPaid: number;
  status: LoanStatus;
  salarySlip: string;
  rejectionReason?: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  loan: string;
  utr: string;
  amount: number;
  paidAt: string;
  createdAt: string;
}

export interface BreFailure {
  rule: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  details?: unknown;
}

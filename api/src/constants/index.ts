export const ROLES = {
  ADMIN: "admin",
  SALES: "sales",
  SANCTION: "sanction",
  DISBURSEMENT: "disbursement",
  COLLECTION: "collection",
  BORROWER: "borrower",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const LOAN_STATUS = {
  APPLIED: "applied",
  SANCTIONED: "sanctioned",
  REJECTED: "rejected",
  DISBURSED: "disbursed",
  CLOSED: "closed",
} as const;

export type LoanStatus = (typeof LOAN_STATUS)[keyof typeof LOAN_STATUS];

export const EMPLOYMENT_MODES = ["salaried", "self-employed", "unemployed"] as const;

export type EmploymentMode = (typeof EMPLOYMENT_MODES)[number];

export const LOAN_LIMITS = {
  MIN_AMOUNT: 50000,
  MAX_AMOUNT: 500000,
  MIN_TENURE_DAYS: 30,
  MAX_TENURE_DAYS: 365,
  INTEREST_RATE: 12,
} as const;

export const BRE_LIMITS = {
  MIN_AGE: 23,
  MAX_AGE: 50,
  MIN_SALARY: 25000,
} as const;

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

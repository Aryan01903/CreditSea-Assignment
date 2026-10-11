import { LoanStatus, Role } from "@/types";

export const LOAN_LIMITS = {
  MIN_AMOUNT: 50000,
  MAX_AMOUNT: 500000,
  MIN_TENURE_DAYS: 30,
  MAX_TENURE_DAYS: 365,
  INTEREST_RATE: 12,
} as const;

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const DASHBOARD_MODULES: { key: string; label: string; role: Role }[] = [
  { key: "sales", label: "Sales", role: "sales" },
  { key: "sanction", label: "Sanction", role: "sanction" },
  { key: "disbursement", label: "Disbursement", role: "disbursement" },
  { key: "collection", label: "Collection", role: "collection" },
];

export const STATUS_STYLES: Record<LoanStatus, string> = {
  applied: "bg-blue-50 text-blue-700 ring-blue-600/20",
  sanctioned: "bg-amber-50 text-amber-700 ring-amber-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  disbursed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  closed: "bg-gray-100 text-gray-700 ring-gray-500/20",
};

export const homeRouteForRole = (role: Role): string => {
  if (role === "borrower") return "/portal";
  if (role === "admin") return "/dashboard/sales";
  return `/dashboard/${role}`;
};

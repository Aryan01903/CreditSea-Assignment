import { api } from "./api";
import {
  ApiEnvelope,
  Lead,
  Loan,
  Payment,
  PersonalDetails,
  User,
} from "@/types";

export const queryKeys = {
  me: ["me"] as const,
  myLoans: ["my-loans"] as const,
  leads: ["leads"] as const,
  sanctionLoans: ["sanction-loans"] as const,
  disbursementLoans: ["disbursement-loans"] as const,
  collectionLoans: ["collection-loans"] as const,
  loanPayments: (loanId: string) => ["loan-payments", loanId] as const,
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<ApiEnvelope<{ user: User }>>("/auth/me");
  return data.data.user;
};

export const getMyLoans = async (): Promise<{ loans: Loan[]; payments: Payment[] }> => {
  const { data } = await api.get<ApiEnvelope<{ loans: Loan[]; payments: Payment[] }>>(
    "/borrower/loans"
  );
  return data.data;
};

export const savePersonalDetails = async (
  payload: Omit<PersonalDetails, "monthlySalary"> & { monthlySalary: number }
): Promise<PersonalDetails> => {
  const { data } = await api.put<ApiEnvelope<{ personalDetails: PersonalDetails }>>(
    "/borrower/personal-details",
    payload
  );
  return data.data.personalDetails;
};

export const uploadSalarySlip = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("salarySlip", file);
  const { data } = await api.post<ApiEnvelope<{ salarySlip: string }>>(
    "/borrower/salary-slip",
    formData
  );
  return data.data.salarySlip;
};

export const applyForLoan = async (payload: {
  amount: number;
  tenureDays: number;
}): Promise<Loan> => {
  const { data } = await api.post<ApiEnvelope<{ loan: Loan }>>("/borrower/loans", payload);
  return data.data.loan;
};

export const getLeads = async (): Promise<Lead[]> => {
  const { data } = await api.get<ApiEnvelope<{ leads: Lead[] }>>("/operations/sales/leads");
  return data.data.leads;
};

export const getSanctionLoans = async (): Promise<Loan[]> => {
  const { data } = await api.get<ApiEnvelope<{ loans: Loan[] }>>("/operations/sanction/loans");
  return data.data.loans;
};

export const decideLoan = async (payload: {
  loanId: string;
  decision: "approve" | "reject";
  reason?: string;
}): Promise<Loan> => {
  const { loanId, ...body } = payload;
  const { data } = await api.patch<ApiEnvelope<{ loan: Loan }>>(
    `/operations/sanction/loans/${loanId}`,
    body
  );
  return data.data.loan;
};

export const getDisbursementLoans = async (): Promise<Loan[]> => {
  const { data } = await api.get<ApiEnvelope<{ loans: Loan[] }>>("/operations/disbursement/loans");
  return data.data.loans;
};

export const disburseLoan = async (loanId: string): Promise<Loan> => {
  const { data } = await api.patch<ApiEnvelope<{ loan: Loan }>>(
    `/operations/disbursement/loans/${loanId}/disburse`
  );
  return data.data.loan;
};

export const getCollectionLoans = async (): Promise<Loan[]> => {
  const { data } = await api.get<ApiEnvelope<{ loans: Loan[] }>>("/operations/collection/loans");
  return data.data.loans;
};

export const getLoanPayments = async (loanId: string): Promise<Payment[]> => {
  const { data } = await api.get<ApiEnvelope<{ payments: Payment[] }>>(
    `/operations/collection/loans/${loanId}/payments`
  );
  return data.data.payments;
};

export const recordPayment = async (payload: {
  loanId: string;
  utr: string;
  amount: number;
  paidAt: string;
}): Promise<Loan> => {
  const { loanId, ...body } = payload;
  const { data } = await api.post<ApiEnvelope<{ loan: Loan; payment: Payment }>>(
    `/operations/collection/loans/${loanId}/payments`,
    body
  );
  return data.data.loan;
};

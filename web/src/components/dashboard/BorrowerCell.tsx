import { Borrower, Loan } from "@/types";

export const getBorrower = (loan: Loan): Borrower | null =>
  typeof loan.borrower === "object" ? loan.borrower : null;

export function BorrowerCell({ loan }: { loan: Loan }) {
  const borrower = getBorrower(loan);
  if (!borrower) return <span className="text-gray-400">—</span>;

  return (
    <div>
      <p className="font-medium text-gray-900">
        {borrower.personalDetails?.fullName ?? borrower.name}
      </p>
      <p className="text-xs text-gray-500">{borrower.email}</p>
    </div>
  );
}

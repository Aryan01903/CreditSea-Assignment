"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BorrowerCell } from "@/components/dashboard/BorrowerCell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Table, Td } from "@/components/ui/Table";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { disburseLoan, getDisbursementLoans, queryKeys } from "@/lib/queries";

export function DisbursementView() {
  const queryClient = useQueryClient();

  const { data: loans = [], isPending } = useQuery({
    queryKey: queryKeys.disbursementLoans,
    queryFn: getDisbursementLoans,
  });

  const disburseMutation = useMutation({
    mutationFn: disburseLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disbursementLoans });
      queryClient.invalidateQueries({ queryKey: queryKeys.collectionLoans });
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Disbursement — Sanctioned loans"
        subtitle="Release funds for approved loans"
      />

      {disburseMutation.isError && (
        <Alert
          tone="error"
          title={getErrorMessage(disburseMutation.error, "Could not disburse the loan")}
        />
      )}

      {loans.length === 0 ? (
        <EmptyState title="Nothing to disburse" message="No sanctioned loans are waiting." />
      ) : (
        <Table headers={["Borrower", "Sanctioned", "Amount", "Tenure", "Repayment", "Actions"]}>
          {loans.map((loan) => (
            <tr key={loan._id} className="hover:bg-gray-50">
              <Td>
                <BorrowerCell loan={loan} />
              </Td>
              <Td>{loan.sanctionedAt ? formatDate(loan.sanctionedAt) : "—"}</Td>
              <Td className="font-medium text-gray-900">{formatCurrency(loan.amount)}</Td>
              <Td>{loan.tenureDays} days</Td>
              <Td>{formatCurrency(loan.totalRepayment)}</Td>
              <Td>
                <Button
                  onClick={() => disburseMutation.mutate(loan._id)}
                  loading={
                    disburseMutation.isPending && disburseMutation.variables === loan._id
                  }
                  className="px-3 py-1.5"
                >
                  Mark disbursed
                </Button>
              </Td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}

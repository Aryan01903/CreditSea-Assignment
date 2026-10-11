"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { BorrowerCell, getBorrower } from "@/components/dashboard/BorrowerCell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SalarySlipLink } from "@/components/dashboard/SalarySlipLink";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Table, Td } from "@/components/ui/Table";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { decideLoan, getSanctionLoans, queryKeys } from "@/lib/queries";
import { Loan } from "@/types";

export function SanctionView() {
  const queryClient = useQueryClient();
  const [rejecting, setRejecting] = useState<Loan | null>(null);
  const [reason, setReason] = useState("");

  const { data: loans = [], isPending } = useQuery({
    queryKey: queryKeys.sanctionLoans,
    queryFn: getSanctionLoans,
  });

  const decideMutation = useMutation({
    mutationFn: decideLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sanctionLoans });
      queryClient.invalidateQueries({ queryKey: queryKeys.disbursementLoans });
      setRejecting(null);
      setReason("");
    },
  });

  const handleReject = (event: FormEvent) => {
    event.preventDefault();
    if (!rejecting) return;
    decideMutation.mutate({ loanId: rejecting._id, decision: "reject", reason });
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Sanction — Applied loans" subtitle="Review applications and decide" />

      {decideMutation.isError && (
        <Alert
          tone="error"
          title={getErrorMessage(decideMutation.error, "Could not update the loan")}
        />
      )}

      {loans.length === 0 ? (
        <EmptyState title="Queue is clear" message="There are no loans waiting for review." />
      ) : (
        <Table
          headers={[
            "Borrower",
            "PAN",
            "Applied",
            "Amount",
            "Tenure",
            "Repayment",
            "Salary slip",
            "Actions",
          ]}
        >
          {loans.map((loan) => (
            <tr key={loan._id} className="hover:bg-gray-50">
              <Td>
                <BorrowerCell loan={loan} />
              </Td>
              <Td>{getBorrower(loan)?.personalDetails?.pan ?? "—"}</Td>
              <Td>{formatDate(loan.createdAt)}</Td>
              <Td className="font-medium text-gray-900">{formatCurrency(loan.amount)}</Td>
              <Td>{loan.tenureDays} days</Td>
              <Td>{formatCurrency(loan.totalRepayment)}</Td>
              <Td>
                <SalarySlipLink url={loan.salarySlip} />
              </Td>
              <Td>
                <div className="flex gap-2">
                  <Button
                    onClick={() => decideMutation.mutate({ loanId: loan._id, decision: "approve" })}
                    loading={decideMutation.isPending && decideMutation.variables?.loanId === loan._id}
                    className="px-3 py-1.5"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setRejecting(loan)}
                    disabled={decideMutation.isPending}
                    className="px-3 py-1.5"
                  >
                    Reject
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <Modal
        open={rejecting !== null}
        title="Reject loan application"
        onClose={() => setRejecting(null)}
      >
        <form onSubmit={handleReject} className="space-y-4">
          {rejecting && (
            <p className="text-sm text-gray-600">
              Rejecting {getBorrower(rejecting)?.name}&apos;s request for{" "}
              {formatCurrency(rejecting.amount)}.
            </p>
          )}
          <Input
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this application being rejected?"
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setRejecting(null)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={decideMutation.isPending}>
              Reject loan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

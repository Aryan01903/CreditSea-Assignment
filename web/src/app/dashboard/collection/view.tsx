"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { BorrowerCell } from "@/components/dashboard/BorrowerCell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Table, Td } from "@/components/ui/Table";
import { getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { getCollectionLoans, getLoanPayments, queryKeys, recordPayment } from "@/lib/queries";
import { Loan } from "@/types";

const today = () => new Date().toISOString().slice(0, 10);

export function CollectionView() {
  const queryClient = useQueryClient();
  const [collecting, setCollecting] = useState<Loan | null>(null);
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(today());

  const { data: loans = [], isPending } = useQuery({
    queryKey: queryKeys.collectionLoans,
    queryFn: getCollectionLoans,
  });

  const { data: payments = [], isPending: paymentsPending } = useQuery({
    queryKey: queryKeys.loanPayments(collecting?._id ?? ""),
    queryFn: () => getLoanPayments(collecting!._id),
    enabled: collecting !== null,
  });

  const paymentMutation = useMutation({
    mutationFn: recordPayment,
    onSuccess: (_loan, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collectionLoans });
      queryClient.invalidateQueries({ queryKey: queryKeys.loanPayments(variables.loanId) });
      setCollecting(null);
    },
  });

  const openPaymentModal = (loan: Loan) => {
    paymentMutation.reset();
    setCollecting(loan);
    setUtr("");
    setAmount("");
    setPaidAt(today());
  };

  const handleRecordPayment = (event: FormEvent) => {
    event.preventDefault();
    if (!collecting) return;
    paymentMutation.mutate({
      loanId: collecting._id,
      utr,
      amount: Number(amount),
      paidAt,
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-brand-600" />
      </div>
    );
  }

  const outstanding = collecting
    ? Math.round((collecting.totalRepayment - collecting.amountPaid) * 100) / 100
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collection — Active loans"
        subtitle="Record borrower payments; loans close automatically when fully repaid"
      />

      {loans.length === 0 ? (
        <EmptyState title="No active loans" message="Disbursed loans will appear here." />
      ) : (
        <Table
          headers={[
            "Borrower",
            "Status",
            "Disbursed",
            "Amount",
            "Repayment",
            "Paid",
            "Outstanding",
            "Actions",
          ]}
        >
          {loans.map((loan) => (
            <tr key={loan._id} className="hover:bg-gray-50">
              <Td>
                <BorrowerCell loan={loan} />
              </Td>
              <Td>
                <StatusBadge status={loan.status} />
              </Td>
              <Td>{loan.disbursedAt ? formatDate(loan.disbursedAt) : "—"}</Td>
              <Td>{formatCurrency(loan.amount)}</Td>
              <Td>{formatCurrency(loan.totalRepayment)}</Td>
              <Td className="text-emerald-700">{formatCurrency(loan.amountPaid)}</Td>
              <Td className="font-medium text-gray-900">
                {formatCurrency(loan.totalRepayment - loan.amountPaid)}
              </Td>
              <Td>
                {loan.status === "disbursed" ? (
                  <Button onClick={() => openPaymentModal(loan)} className="px-3 py-1.5">
                    Record payment
                  </Button>
                ) : (
                  <span className="text-xs text-gray-500">
                    Closed {loan.closedAt ? formatDate(loan.closedAt) : ""}
                  </span>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={collecting !== null} title="Record payment" onClose={() => setCollecting(null)}>
        <form onSubmit={handleRecordPayment} className="space-y-4">
          {paymentMutation.isError && (
            <Alert
              tone="error"
              title={getErrorMessage(paymentMutation.error, "Could not record the payment")}
            />
          )}
          {collecting && (
            <p className="text-sm text-gray-600">
              Outstanding balance:{" "}
              <span className="font-semibold text-gray-900">{formatCurrency(outstanding)}</span>
            </p>
          )}
          <Input
            label="UTR number"
            value={utr}
            onChange={(e) => setUtr(e.target.value.toUpperCase())}
            placeholder="Unique transaction reference"
            required
          />
          <Input
            label="Amount (₹)"
            type="number"
            min={1}
            max={outstanding}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            label="Payment date"
            type="date"
            value={paidAt}
            max={today()}
            onChange={(e) => setPaidAt(e.target.value)}
            required
          />

          {paymentsPending ? (
            <Spinner className="text-brand-600" />
          ) : (
            payments.length > 0 && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Previous payments
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {payments.map((payment) => (
                    <li
                      key={payment._id}
                      className="flex flex-wrap justify-between gap-x-4 gap-y-1"
                    >
                      <span>
                        {formatDate(payment.paidAt)} · {payment.utr}
                      </span>
                      <span className="font-medium">{formatCurrency(payment.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setCollecting(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={paymentMutation.isPending}>
              Save payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

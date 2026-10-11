"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate } from "@/lib/format";
import { getMyLoans, queryKeys } from "@/lib/queries";

export function PortalView() {
  const { data, isPending } = useQuery({ queryKey: queryKeys.myLoans, queryFn: getMyLoans });

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-brand-600" />
      </div>
    );
  }

  const loans = data?.loans ?? [];
  const payments = data?.payments ?? [];
  const hasActiveLoan = loans.some((loan) =>
    ["applied", "sanctioned", "disbursed"].includes(loan.status)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">My Loans</h1>
          <p className="mt-1 text-sm text-gray-500">Track your applications and repayments</p>
        </div>
        {!hasActiveLoan && (
          <Link href="/portal/apply">
            <Button>Apply for a loan</Button>
          </Link>
        )}
      </div>

      {loans.length === 0 ? (
        <EmptyState
          title="No loans yet"
          message="Start a new application to get your first loan."
        />
      ) : (
        <div className="grid gap-4">
          {loans.map((loan) => {
            const loanPayments = payments.filter((payment) => payment.loan === loan._id);
            const outstanding = loan.totalRepayment - loan.amountPaid;

            return (
              <Card key={loan._id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-bold text-gray-900 sm:text-xl">
                        {formatCurrency(loan.amount)}
                      </span>
                      <StatusBadge status={loan.status} />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Applied on {formatDate(loan.createdAt)} · {loan.tenureDays} days ·{" "}
                      {loan.interestRate}% p.a.
                    </p>
                  </div>
                  <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3 sm:gap-6">
                    <div className="flex justify-between sm:block">
                      <dt className="text-gray-500">Total repayment</dt>
                      <dd className="font-semibold text-gray-900">
                        {formatCurrency(loan.totalRepayment)}
                      </dd>
                    </div>
                    <div className="flex justify-between sm:block">
                      <dt className="text-gray-500">Paid</dt>
                      <dd className="font-semibold text-emerald-700">
                        {formatCurrency(loan.amountPaid)}
                      </dd>
                    </div>
                    <div className="flex justify-between sm:block">
                      <dt className="text-gray-500">Outstanding</dt>
                      <dd className="font-semibold text-gray-900">{formatCurrency(outstanding)}</dd>
                    </div>
                  </dl>
                </div>

                {loan.status === "rejected" && loan.rejectionReason && (
                  <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                    Rejected: {loan.rejectionReason}
                  </p>
                )}

                {loanPayments.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700">Payments</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {loanPayments.map((payment) => (
                        <li
                          key={payment._id}
                          className="flex flex-wrap justify-between gap-x-4 gap-y-1"
                        >
                          <span>
                            {formatDate(payment.paidAt)} · UTR {payment.utr}
                          </span>
                          <span className="font-medium">{formatCurrency(payment.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

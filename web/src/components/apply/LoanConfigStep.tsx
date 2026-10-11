"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { getErrorMessage } from "@/lib/api";
import { LOAN_LIMITS } from "@/lib/constants";
import { computeInterest, formatCurrency } from "@/lib/format";
import { applyForLoan } from "@/lib/queries";
import { Loan } from "@/types";

interface Props {
  onApplied: (loan: Loan) => void;
  onBack: () => void;
}

export function LoanConfigStep({ onApplied, onBack }: Props) {
  const [amount, setAmount] = useState(100000);
  const [tenureDays, setTenureDays] = useState(180);

  const applyMutation = useMutation({
    mutationFn: applyForLoan,
    onSuccess: onApplied,
  });

  const { interest, totalRepayment } = useMemo(
    () => computeInterest(amount, tenureDays, LOAN_LIMITS.INTEREST_RATE),
    [amount, tenureDays]
  );

  return (
    <div className="space-y-6">
      {applyMutation.isError && (
        <Alert
          tone="error"
          title={getErrorMessage(applyMutation.error, "Could not submit your application")}
        />
      )}

      <div className="space-y-6">
        <Slider
          label="Loan amount"
          value={amount}
          min={LOAN_LIMITS.MIN_AMOUNT}
          max={LOAN_LIMITS.MAX_AMOUNT}
          step={5000}
          displayValue={formatCurrency(amount)}
          onChange={setAmount}
        />
        <Slider
          label="Tenure"
          value={tenureDays}
          min={LOAN_LIMITS.MIN_TENURE_DAYS}
          max={LOAN_LIMITS.MAX_TENURE_DAYS}
          step={1}
          displayValue={`${tenureDays} days`}
          onChange={setTenureDays}
        />
      </div>

      <div className="rounded-xl bg-brand-50 p-4 ring-1 ring-inset ring-brand-100 sm:p-5">
        <p className="text-sm font-semibold text-brand-900">Repayment summary</p>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-brand-700">Principal</dt>
            <dd className="mt-0.5 font-semibold text-brand-950">{formatCurrency(amount)}</dd>
          </div>
          <div>
            <dt className="text-brand-700">Interest rate</dt>
            <dd className="mt-0.5 font-semibold text-brand-950">
              {LOAN_LIMITS.INTEREST_RATE}% p.a.
            </dd>
          </div>
          <div>
            <dt className="text-brand-700">Interest ({tenureDays} days)</dt>
            <dd className="mt-0.5 font-semibold text-brand-950">{formatCurrency(interest)}</dd>
          </div>
          <div>
            <dt className="text-brand-700">Total repayment</dt>
            <dd className="mt-0.5 font-semibold text-brand-950">
              {formatCurrency(totalRepayment)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => applyMutation.mutate({ amount, tenureDays })}
          loading={applyMutation.isPending}
        >
          Apply for this loan
        </Button>
      </div>
    </div>
  );
}

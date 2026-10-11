"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoanConfigStep } from "@/components/apply/LoanConfigStep";
import { PersonalDetailsStep } from "@/components/apply/PersonalDetailsStep";
import { SalarySlipStep } from "@/components/apply/SalarySlipStep";
import { Stepper } from "@/components/apply/Stepper";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { queryKeys } from "@/lib/queries";
import { PersonalDetails } from "@/types";

export function ApplyView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading, updateUser } = useCurrentUser();
  const [step, setStep] = useState(0);
  const [applied, setApplied] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!loading && user && !initialized) {
      if (user.personalDetails) setStep(1);
      setInitialized(true);
    }
  }, [loading, user, initialized]);

  const handleDetailsComplete = (details: PersonalDetails) => {
    updateUser((previous) => ({ ...previous, personalDetails: details }));
    setStep(1);
  };

  const handleSlipComplete = (slip: string) => {
    updateUser((previous) => ({ ...previous, salarySlip: slip }));
    setStep(2);
  };

  const handleApplied = () => {
    setApplied(true);
    queryClient.invalidateQueries({ queryKey: queryKeys.myLoans });
    setTimeout(() => router.replace("/portal"), 1500);
  };

  if (loading || !initialized) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Loan application</h1>
        <p className="mt-1 text-sm text-gray-500">Complete the steps below to apply</p>
      </div>

      <Stepper current={step} />

      {applied ? (
        <Alert tone="success" title="Application submitted">
          Your loan request has been created and is pending review. Redirecting…
        </Alert>
      ) : (
        <Card>
          {step === 0 && (
            <PersonalDetailsStep
              initial={user?.personalDetails ?? null}
              onComplete={handleDetailsComplete}
            />
          )}
          {step === 1 && (
            <SalarySlipStep
              existingSlip={user?.salarySlip ?? null}
              onComplete={handleSlipComplete}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && <LoanConfigStep onApplied={handleApplied} onBack={() => setStep(1)} />}
        </Card>
      )}
    </div>
  );
}

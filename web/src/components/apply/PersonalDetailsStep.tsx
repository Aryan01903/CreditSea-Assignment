"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getErrorDetails, getErrorMessage } from "@/lib/api";
import { PAN_REGEX } from "@/lib/constants";
import { savePersonalDetails } from "@/lib/queries";
import { BreFailure, EmploymentMode, PersonalDetails } from "@/types";

const EMPLOYMENT_OPTIONS = [
  { value: "salaried", label: "Salaried" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "unemployed", label: "Unemployed" },
];

interface Props {
  initial: PersonalDetails | null;
  onComplete: (details: PersonalDetails) => void;
}

export function PersonalDetailsStep({ initial, onComplete }: Props) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [pan, setPan] = useState(initial?.pan ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(initial?.dateOfBirth?.slice(0, 10) ?? "");
  const [monthlySalary, setMonthlySalary] = useState(
    initial?.monthlySalary ? String(initial.monthlySalary) : ""
  );
  const [employmentMode, setEmploymentMode] = useState<EmploymentMode>(
    initial?.employmentMode ?? "salaried"
  );
  const [panError, setPanError] = useState("");

  const saveMutation = useMutation({
    mutationFn: savePersonalDetails,
    onSuccess: onComplete,
  });

  const failures = getErrorDetails<BreFailure[]>(saveMutation.error) ?? [];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedPan = pan.trim().toUpperCase();
    if (!PAN_REGEX.test(normalizedPan)) {
      setPanError("PAN must match the format AAAAA9999A");
      return;
    }
    setPanError("");

    saveMutation.mutate({
      fullName,
      pan: normalizedPan,
      dateOfBirth,
      monthlySalary: Number(monthlySalary),
      employmentMode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {saveMutation.isError && (
        <Alert tone="error" title={getErrorMessage(saveMutation.error, "Could not save your details")}>
          {failures.length > 0 && (
            <ul className="list-inside list-disc space-y-1">
              {failures.map((failure) => (
                <li key={failure.rule}>{failure.message}</li>
              ))}
            </ul>
          )}
        </Alert>
      )}
      <Input
        label="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="As per PAN card"
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="PAN"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          maxLength={10}
          error={panError}
          required
        />
        <Input
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Monthly salary (₹)"
          type="number"
          min={0}
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(e.target.value)}
          placeholder="50000"
          required
        />
        <Select
          label="Employment mode"
          options={EMPLOYMENT_OPTIONS}
          value={employmentMode}
          onChange={(e) => setEmploymentMode(e.target.value as EmploymentMode)}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={saveMutation.isPending}>
          Check eligibility & continue
        </Button>
      </div>
    </form>
  );
}

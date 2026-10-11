"use client";

import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useRef, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/api";
import { uploadSalarySlip } from "@/lib/queries";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface Props {
  existingSlip: string | null;
  onComplete: (slip: string) => void;
  onBack: () => void;
}

export function SalarySlipStep({ existingSlip, onComplete, onBack }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const uploadMutation = useMutation({
    mutationFn: uploadSalarySlip,
    onSuccess: onComplete,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return setFile(null);
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFile(null);
      return setFileError("Only PDF, JPG and PNG files are allowed");
    }
    if (selected.size > MAX_SIZE) {
      setFile(null);
      return setFileError("File must be 5 MB or smaller");
    }
    setFile(selected);
  };

  const error =
    fileError ||
    (uploadMutation.isError ? getErrorMessage(uploadMutation.error, "Upload failed") : "");

  return (
    <div className="space-y-4">
      {error && <Alert tone="error" title={error} />}
      {existingSlip && !file && (
        <Alert tone="info" title="A salary slip is already on file">
          Upload a new file to replace it, or continue with the existing one.
        </Alert>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center transition-colors hover:border-brand-400 hover:bg-brand-50 sm:px-6"
      >
        <svg className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <span className="break-all text-sm font-medium text-gray-700">
          {file ? file.name : "Click to choose a file"}
        </span>
        <span className="text-xs text-gray-500">PDF, JPG or PNG · max 5 MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <div className="flex flex-col gap-2 sm:flex-row">
          {existingSlip && !file && (
            <Button variant="secondary" onClick={() => onComplete(existingSlip)}>
              Use existing slip
            </Button>
          )}
          <Button
            onClick={() => file && uploadMutation.mutate(file)}
            loading={uploadMutation.isPending}
            disabled={!file}
          >
            Upload & continue
          </Button>
        </div>
      </div>
    </div>
  );
}

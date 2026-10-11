import { STATUS_STYLES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { LoanStatus } from "@/types";

export function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

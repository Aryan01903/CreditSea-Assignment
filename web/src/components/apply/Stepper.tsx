import { cn } from "@/lib/cn";

const STEPS = ["Personal details", "Salary slip", "Loan configuration"];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const state = index < current ? "done" : index === current ? "active" : "upcoming";
        return (
          <li key={step} className="flex flex-1 flex-col gap-2">
            <div
              className={cn(
                "h-1.5 rounded-full",
                state === "done" && "bg-brand-600",
                state === "active" && "bg-brand-400",
                state === "upcoming" && "bg-gray-200"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium sm:text-sm",
                state === "upcoming" ? "text-gray-400" : "text-gray-900"
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

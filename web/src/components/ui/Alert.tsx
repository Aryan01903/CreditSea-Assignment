import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "error" | "success" | "info";

const tones: Record<Tone, string> = {
  error: "bg-red-50 text-red-800 ring-red-600/20",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
  info: "bg-blue-50 text-blue-800 ring-blue-600/20",
};

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("rounded-lg p-4 text-sm ring-1 ring-inset", tones[tone])}>
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}

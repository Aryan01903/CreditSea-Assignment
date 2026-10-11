import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5", className)}>
      {children}
    </div>
  );
}

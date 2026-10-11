"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/auth";
import { DASHBOARD_MODULES } from "@/lib/constants";
import { cn } from "@/lib/cn";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const modules = DASHBOARD_MODULES.filter(
    (module) => user?.role === "admin" || module.role === user?.role
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <span className="text-lg font-bold text-brand-700">LoanPilot Ops</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {modules.map((module) => {
            const href = `/dashboard/${module.key}`;
            const active = pathname.startsWith(href);
            return (
              <Link
                key={module.key}
                href={href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {module.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="truncate text-xs capitalize text-gray-500">{user?.role}</p>
          <Button variant="secondary" onClick={logout} className="mt-3 w-full">
            Log out
          </Button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <span className="text-lg font-bold text-brand-700">LoanPilot Ops</span>
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 md:hidden">
          {modules.map((module) => {
            const href = `/dashboard/${module.key}`;
            const active = pathname.startsWith(href);
            return (
              <Link
                key={module.key}
                href={href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
                  active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"
                )}
              >
                {module.label}
              </Link>
            );
          })}
        </nav>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

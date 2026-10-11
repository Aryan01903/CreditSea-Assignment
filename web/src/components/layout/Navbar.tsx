"use client";

import Link from "next/link";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export function Navbar({ userName }: { userName?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/portal" className="text-lg font-bold text-brand-700">
          LoanPilot
        </Link>
        <div className="flex items-center gap-4">
          {userName && <span className="hidden text-sm text-gray-600 sm:block">{userName}</span>}
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}

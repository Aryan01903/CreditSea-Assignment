"use client";

import { Navbar } from "@/components/layout/Navbar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useCurrentUser();

  return (
    <div className="min-h-screen">
      <Navbar userName={user?.name} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { Spinner } from "@/components/ui/Spinner";
import { homeRouteForRole } from "@/lib/constants";
import { Role } from "@/types";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const role = (Cookies.get("role") as Role | undefined) ?? "borrower";
    router.replace(homeRouteForRole(role));
  }, [router]);

  return (
    <div className="flex justify-center py-20">
      <Spinner className="text-brand-600" />
    </div>
  );
}

import type { Metadata } from "next";
import { PortalView } from "./view";

export const metadata: Metadata = {
  title: "My loans",
  description: "Track your LoanPilot applications, repayments and outstanding balance.",
  robots: { index: false },
};

export default function PortalPage() {
  return <PortalView />;
}

import type { Metadata } from "next";
import { DisbursementView } from "./view";

export const metadata: Metadata = {
  title: "Disbursement queue",
  description: "Release funds for sanctioned loans.",
  robots: { index: false },
};

export default function DisbursementPage() {
  return <DisbursementView />;
}

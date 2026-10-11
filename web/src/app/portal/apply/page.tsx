import type { Metadata } from "next";
import { ApplyView } from "./view";

export const metadata: Metadata = {
  title: "Apply for a loan",
  description:
    "Apply for a LoanPilot personal loan of ₹50,000 to ₹5,00,000 with a fixed 12% p.a. simple interest rate.",
  robots: { index: false },
};

export default function ApplyPage() {
  return <ApplyView />;
}

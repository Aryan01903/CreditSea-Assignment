import type { Metadata } from "next";
import { RegisterView } from "./view";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a free LoanPilot account and apply for a personal loan of up to ₹5,00,000 in minutes.",
};

export default function RegisterPage() {
  return <RegisterView />;
}

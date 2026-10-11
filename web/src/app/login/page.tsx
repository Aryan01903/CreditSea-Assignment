import type { Metadata } from "next";
import { LoginView } from "./view";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to LoanPilot to track your loan application or manage the loan pipeline.",
};

export default function LoginPage() {
  return <LoginView />;
}

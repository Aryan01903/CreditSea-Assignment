import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "LoanPilot — Loan Management System",
    template: "%s · LoanPilot",
  },
  description:
    "LoanPilot is a lending platform where borrowers apply for loans in minutes and operations teams manage sanction, disbursement and collection in one place.",
  keywords: ["loan", "lending", "loan management", "personal loan", "LoanPilot"],
  applicationName: "LoanPilot",
  openGraph: {
    title: "LoanPilot — Loan Management System",
    description:
      "Apply for a loan in minutes with transparent simple-interest pricing and instant eligibility checks.",
    siteName: "LoanPilot",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2946e2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

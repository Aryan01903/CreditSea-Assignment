import type { Metadata } from "next";
import { SalesView } from "./view";

export const metadata: Metadata = {
  title: "Sales leads",
  description: "Registered borrowers who have not applied for a loan yet.",
  robots: { index: false },
};

export default function SalesPage() {
  return <SalesView />;
}

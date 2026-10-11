import type { Metadata } from "next";
import { SanctionView } from "./view";

export const metadata: Metadata = {
  title: "Sanction queue",
  description: "Review applied loans and approve or reject them.",
  robots: { index: false },
};

export default function SanctionPage() {
  return <SanctionView />;
}

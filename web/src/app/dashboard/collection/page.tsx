import type { Metadata } from "next";
import { CollectionView } from "./view";

export const metadata: Metadata = {
  title: "Collections",
  description: "Record borrower payments on active loans.",
  robots: { index: false },
};

export default function CollectionPage() {
  return <CollectionView />;
}

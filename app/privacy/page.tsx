import type { Metadata } from "next";

import { PrivacyPage } from "@/src/features/landing/ui/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Auren",
  description: "How Auren collects, uses, and protects your data in the workflow studio.",
};

export default function PrivacyRoute() {
  return <PrivacyPage />;
}

import type { Metadata } from "next";

import { TermsPage } from "@/src/features/landing/ui/TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service — Auren",
  description: "Terms governing your use of the Auren workflow studio and automations.",
};

export default function TermsRoute() {
  return <TermsPage />;
}

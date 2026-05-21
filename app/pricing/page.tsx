import type { Metadata } from "next";

import { PricingPage } from "@/src/features/landing/ui/PricingPage";

export const metadata: Metadata = {
  title: "Pricing — Auren",
  description:
    "Simple plans for the Auren workflow studio — start free on Canvas, scale with Studio and Operations.",
};

export default function PricingRoute() {
  return <PricingPage />;
}

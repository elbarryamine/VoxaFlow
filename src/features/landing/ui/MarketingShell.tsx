import type { ReactNode } from "react";

import { LandingFooter } from "@/src/features/landing/ui/LandingFooter";
import { LandingNav } from "@/src/features/landing/ui/LandingNav";

interface MarketingShellProps {
  children: ReactNode;
}

export const MarketingShell = ({ children }: MarketingShellProps) => (
  <div className="landing-canvas relative min-h-screen bg-background font-manrope text-on-surface">
    <div
      className="landing-frame pointer-events-none fixed inset-3 z-40 rounded-2xl border border-border/40 sm:inset-5"
      aria-hidden
    />

    <LandingNav />
    {children}
    <LandingFooter />
  </div>
);

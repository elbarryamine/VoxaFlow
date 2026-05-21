import type { ReactNode } from "react";
import { cn } from "@/src/shared/utils/cn";

interface LandingStepMarkerProps {
  children: ReactNode;
  className?: string;
}

/** Large step numeral with animated handoff when hovering between cards in a grid. */
export const LandingStepMarker = ({ children, className }: LandingStepMarkerProps) => (
  <span className={cn("landing-step-marker font-newsreader text-4xl font-bold leading-none", className)} aria-hidden>
    <span className="landing-step-marker__value">{children}</span>
  </span>
);

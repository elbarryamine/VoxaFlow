"use client";

import { useEffect, useState } from "react";

import { LANDING_FLOWS } from "@/src/features/landing/constants/LANDING_FLOWS";

/** Matches desktop demo: ~4.7s per flow × 7 */
const ROTATE_MS = 4700;

export const LandingMobileFlowCaption = () => {
  const [flowIndex, setFlowIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setFlowIndex((index) => (index + 1) % LANDING_FLOWS.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const flow = LANDING_FLOWS[flowIndex]!;

  return (
    <p
      key={flow.id}
      className="landing-flow-caption relative mt-3 font-manrope text-[13px] font-medium text-on-surface"
    >
      {flow.mobileCaption.split(" → ").map((segment, index, parts) => (
        <span key={`${flow.id}-${segment}`}>
          {index > 0 && (
            <span className="text-on-surface-variant"> → </span>
          )}
          <span
            className={
              index === parts.length - 1 ? "font-bold text-secondary" : "font-bold"
            }
          >
            {segment}
          </span>
        </span>
      ))}
    </p>
  );
};

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  consumeQueuedLandingSectionScroll,
  scrollFromLocationHash,
  scrollToLandingSection,
} from "@/src/features/landing/utils/scroll-to-landing-section";

export const LandingScrollOnMount = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    scrollFromLocationHash();

    const queued = consumeQueuedLandingSectionScroll();
    if (!queued) return;

    const timer = window.setTimeout(() => {
      scrollToLandingSection(queued);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
};

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/src/shared/utils/cn";

interface LandingRevealGroupProps {
  children: ReactNode;
  className?: string;
}

export const LandingRevealGroup = ({ children, className }: LandingRevealGroupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("landing-is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          root.classList.add("landing-is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("landing-reveal-group", className)}>
      {children}
    </div>
  );
};

interface LandingRevealItemProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms when the group enters view */
  delay?: number;
  variant?: "up" | "scale";
}

export const LandingRevealItem = ({
  children,
  className,
  delay = 0,
  variant = "up",
}: LandingRevealItemProps) => (
  <div
    className={cn(
      "landing-reveal-item",
      variant === "scale" && "landing-reveal-item--scale",
      className,
    )}
    style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
  >
    {children}
  </div>
);

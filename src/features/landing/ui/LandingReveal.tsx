"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/src/shared/utils/cn";

interface LandingRevealGroupProps {
  children: ReactNode;
  className?: string;
}

/** Optional wrapper; each {@link LandingRevealItem} reveals on its own when scrolled into view. */
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
        }
      },
      { threshold: 0.05, rootMargin: "0px" },
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
  /** Stagger delay in ms when the item enters view */
  delay?: number;
  variant?: "up" | "scale";
}

export const LandingRevealItem = ({
  children,
  className,
  delay = 0,
  variant = "up",
}: LandingRevealItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("landing-reveal-item--visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          root.classList.add("landing-reveal-item--visible");
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
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
};

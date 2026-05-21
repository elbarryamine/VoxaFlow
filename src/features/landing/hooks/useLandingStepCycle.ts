"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const STEP_CYCLE_MS = 2800;

export const useLandingStepCycle = (
  itemCount: number,
  rootRef: RefObject<HTMLElement | null>,
) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isCyclingEnabled, setIsCyclingEnabled] = useState(false);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    prefersReducedMotionRef.current = reducedMotion;
    setIsCyclingEnabled(!reducedMotion);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || itemCount < 2) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [itemCount, rootRef]);

  useEffect(() => {
    if (!isInView || isHovering || itemCount < 2 || prefersReducedMotionRef.current) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % itemCount);
    }, STEP_CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [isInView, isHovering, itemCount]);

  return { activeIndex, isHovering, setIsHovering, isCyclingEnabled };
};

"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useLandingStepCycle } from "@/src/features/landing/hooks/useLandingStepCycle";
import { cn } from "@/src/shared/utils/cn";

interface LandingStepCycleContextValue {
  activeIndex: number;
  isCyclingEnabled: boolean;
}

const LandingStepCycleContext = createContext<LandingStepCycleContextValue>({
  activeIndex: 0,
  isCyclingEnabled: false,
});

export const useLandingStepCycleIndex = (index: number) => {
  const { activeIndex, isCyclingEnabled } = useContext(LandingStepCycleContext);
  return isCyclingEnabled && activeIndex === index;
};

interface LandingStepGridProps {
  itemCount: number;
  className?: string;
  children: ReactNode;
}

export const LandingStepGrid = ({ itemCount, className, children }: LandingStepGridProps) => {
  const listRef = useRef<HTMLOListElement>(null);
  const { activeIndex, setIsHovering, isCyclingEnabled } = useLandingStepCycle(itemCount, listRef);

  return (
    <LandingStepCycleContext.Provider value={{ activeIndex, isCyclingEnabled }}>
      <ol
        ref={listRef}
        className={cn("landing-step-grid", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </ol>
    </LandingStepCycleContext.Provider>
  );
};

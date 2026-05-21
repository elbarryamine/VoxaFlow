"use client";

import { Cursor } from "@phosphor-icons/react";
import type { LandingCursorPosition } from "@/src/features/landing/hooks/useLandingFlowDemo";
import { cn } from "@/src/shared/utils/cn";

interface LandingFlowCursorProps {
  position: LandingCursorPosition | null;
  isClicking: boolean;
  visible: boolean;
}

export const LandingFlowCursor = ({
  position,
  isClicking,
  visible,
}: LandingFlowCursorProps) => {
  if (!position || !visible) return null;

  return (
    <div
      className="landing-flow-cursor pointer-events-none absolute z-40 transition-[left,top,opacity] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        left: position.x,
        top: position.y,
      }}
      aria-hidden
    >
      <div className="relative size-6 origin-top-left rotate-22">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            className={cn(
              "landing-flow-cursor-ring block h-8 w-8 rounded-full border-2 border-primary/40",
              isClicking && "landing-flow-cursor-ring--click",
            )}
          />
        </div>
        <Cursor
          className={cn(
            "relative h-6 w-6 text-on-surface drop-shadow-md transition-transform duration-200",
            isClicking && "scale-90",
          )}
          weight="fill"
        />
      </div>
    </div>
  );
};

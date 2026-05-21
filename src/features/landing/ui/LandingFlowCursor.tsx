"use client";

import { useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Cursor } from "@phosphor-icons/react";

interface LandingFlowCursorProps {
  targetNodeId: string | null;
  visible: boolean;
}

export const LandingFlowCursor = ({
  targetNodeId,
  visible,
}: LandingFlowCursorProps) => {
  const { getNode, flowToScreenPosition } = useReactFlow();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!targetNodeId || !visible) return;

    const updatePosition = () => {
      const node = getNode(targetNodeId);
      if (!node) return;

      const screen = flowToScreenPosition({
        x: node.position.x + 108,
        y: node.position.y + 28,
      });
      setPosition(screen);
    };

    updatePosition();
    const afterFit = window.setTimeout(updatePosition, 560);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.clearTimeout(afterFit);
      window.removeEventListener("resize", updatePosition);
    };
  }, [targetNodeId, visible, getNode, flowToScreenPosition]);

  return (
    <div
      className="landing-flow-cursor pointer-events-none absolute z-30 transition-[left,top,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        left: position.x,
        top: position.y,
        opacity: visible && targetNodeId ? 1 : 0,
      }}
      aria-hidden
    >
      <Cursor
        className="h-6 w-6 text-on-surface drop-shadow-md"
        weight="fill"
      />
      <span className="landing-flow-cursor-ring absolute -left-1 -top-1 h-8 w-8 rounded-full border-2 border-primary/40" />
    </div>
  );
};

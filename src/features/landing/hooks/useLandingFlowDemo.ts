"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Edge, Node } from "@xyflow/react";

import { LANDING_FLOWS } from "@/src/features/landing/constants/LANDING_FLOWS";
import type { WorkflowNodeData } from "@/src/features/workflows/types/Workflow.types";

const CURSOR_STEP_MS = 1400;
const FLOW_HOLD_MS = 900;

export const useLandingFlowDemo = () => {
  const [flowIndex, setFlowIndex] = useState(0);
  const [cursorStep, setCursorStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionLock = useRef(false);

  const flow = LANDING_FLOWS[flowIndex]!;
  const activeNodeId = flow.cursorPath[cursorStep] ?? null;

  const nodes: Node<WorkflowNodeData>[] = useMemo(
    () =>
      flow.nodes.map((node) => ({
        ...node,
        selected: node.id === activeNodeId,
      })),
    [flow.nodes, activeNodeId],
  );

  const edges: Edge[] = flow.edges;

  const advance = useCallback(() => {
    if (transitionLock.current) return;

    setCursorStep((step) => {
      if (step < flow.cursorPath.length - 1) return step + 1;

      transitionLock.current = true;
      setIsTransitioning(true);
      window.setTimeout(() => {
        setFlowIndex((index) => (index + 1) % LANDING_FLOWS.length);
        setCursorStep(0);
        setIsTransitioning(false);
        transitionLock.current = false;
      }, FLOW_HOLD_MS);

      return step;
    });
  }, [flow.cursorPath.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(advance, CURSOR_STEP_MS);
    return () => window.clearInterval(timer);
  }, [advance, flowIndex]);

  return {
    flow,
    flowIndex,
    nodes,
    edges,
    activeNodeId,
    isTransitioning,
    flowCount: LANDING_FLOWS.length,
  };
};

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { Edge, Node } from "@xyflow/react";

import { LANDING_FLOWS } from "@/src/features/landing/constants/LANDING_FLOWS";
import type { WorkflowNodeData } from "@/src/features/workflows/types/Workflow.types";

export interface LandingCursorPosition {
  x: number;
  y: number;
}

interface UseLandingFlowDemoOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  optionRefs: RefObject<(HTMLLIElement | null)[]>;
  isActive: boolean;
}

/** Tight, even phases so the demo reads as one continuous loop. */
type DemoPhase = "on-trigger" | "menu-open" | "on-option" | "applying";

const PHASE_MS: Record<DemoPhase, number> = {
  /** Dwell on the active flow before opening the picker again */
  "on-trigger": 2600,
  "menu-open": 520,
  "on-option": 1100,
  applying: 520,
};

const FLOW_COUNT = LANDING_FLOWS.length;

const getRelativeCenter = (
  element: HTMLElement,
  container: HTMLElement,
): LandingCursorPosition => ({
  x:
    element.getBoundingClientRect().left -
    container.getBoundingClientRect().left +
    element.getBoundingClientRect().width / 2 -
    4,
  y:
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    element.getBoundingClientRect().height / 2 -
    2,
});

const scrollOptionIntoMenu = (option: HTMLLIElement) => {
  const menu = option.parentElement;
  if (!menu || menu.scrollHeight <= menu.clientHeight) return;

  const optionTop = option.offsetTop;
  const optionBottom = optionTop + option.offsetHeight;

  if (optionTop < menu.scrollTop) {
    menu.scrollTop = optionTop;
  } else if (optionBottom > menu.scrollTop + menu.clientHeight) {
    menu.scrollTop = optionBottom - menu.clientHeight;
  }
};

export const useLandingFlowDemo = ({
  containerRef,
  triggerRef,
  optionRefs,
  isActive,
}: UseLandingFlowDemoOptions) => {
  const [flowIndex, setFlowIndex] = useState(0);
  const [phase, setPhase] = useState<DemoPhase>("on-trigger");
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState<number | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<LandingCursorPosition | null>(
    null,
  );
  const targetFlowRef = useRef(1);
  const flowIndexRef = useRef(flowIndex);
  flowIndexRef.current = flowIndex;

  const flow = LANDING_FLOWS[flowIndex]!;
  const isCanvasFading = phase === "applying";

  const nodes: Node<WorkflowNodeData>[] = useMemo(
    () => flow.nodes.map((node) => ({ ...node, selected: false })),
    [flow.nodes],
  );

  const edges: Edge[] = flow.edges;

  const measureTrigger = useCallback(() => {
    const container = containerRef.current;
    const trigger = triggerRef.current;
    if (!container || !trigger) return null;
    return getRelativeCenter(trigger, container);
  }, [containerRef, triggerRef]);

  const measureOption = useCallback(
    (index: number) => {
      const container = containerRef.current;
      const option = optionRefs.current?.[index];
      if (!container || !option) return null;
      scrollOptionIntoMenu(option);
      return getRelativeCenter(option, container);
    },
    [containerRef, optionRefs],
  );

  const pulseClick = useCallback(() => {
    setIsClicking(true);
    window.setTimeout(() => setIsClicking(false), 180);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isActive || prefersReducedMotion) {
      setCursorPosition(null);
      setMenuOpen(false);
      setHighlightedOption(null);
      return;
    }

    let timeoutId: number;

    switch (phase) {
      case "on-trigger": {
        targetFlowRef.current = (flowIndexRef.current + 1) % FLOW_COUNT;
        setMenuOpen(false);
        setHighlightedOption(null);
        const triggerPos = measureTrigger();
        if (triggerPos) setCursorPosition(triggerPos);
        timeoutId = window.setTimeout(
          () => setPhase("menu-open"),
          PHASE_MS["on-trigger"],
        );
        break;
      }

      case "menu-open": {
        setMenuOpen(true);
        pulseClick();
        const triggerPos = measureTrigger();
        if (triggerPos) setCursorPosition(triggerPos);
        timeoutId = window.setTimeout(
          () => setPhase("on-option"),
          PHASE_MS["menu-open"],
        );
        break;
      }

      case "on-option": {
        const targetIndex = targetFlowRef.current;
        setHighlightedOption(targetIndex);
        const optionPos = measureOption(targetIndex);
        if (optionPos) setCursorPosition(optionPos);
        timeoutId = window.setTimeout(
          () => setPhase("applying"),
          PHASE_MS["on-option"],
        );
        break;
      }

      case "applying": {
        pulseClick();
        setFlowIndex(targetFlowRef.current);
        setMenuOpen(false);
        setHighlightedOption(null);
        const triggerPos = measureTrigger();
        if (triggerPos) setCursorPosition(triggerPos);
        timeoutId = window.setTimeout(
          () => setPhase("on-trigger"),
          PHASE_MS.applying,
        );
        break;
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [isActive, measureOption, measureTrigger, phase, pulseClick]);

  useEffect(() => {
    const onResize = () => {
      if (phase === "on-option") {
        const optionPos = measureOption(targetFlowRef.current);
        if (optionPos) setCursorPosition(optionPos);
        return;
      }
      const triggerPos = measureTrigger();
      if (triggerPos) setCursorPosition(triggerPos);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureOption, measureTrigger, phase]);

  return {
    flow,
    flowIndex,
    nodes,
    edges,
    menuOpen,
    highlightedOption,
    cursorPosition,
    isClicking,
    isCanvasFading,
    flowCount: FLOW_COUNT,
  };
};

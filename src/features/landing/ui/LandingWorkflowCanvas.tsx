"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { LANDING_FLOWS } from "@/src/features/landing/constants/LANDING_FLOWS";
import { useLandingFlowDemo } from "@/src/features/landing/hooks/useLandingFlowDemo";
import { LandingFlowCursor } from "@/src/features/landing/ui/LandingFlowCursor";
import { LandingFlowNode } from "@/src/features/landing/ui/LandingFlowNode";
import { LandingFlowPicker } from "@/src/features/landing/ui/LandingFlowPicker";

const NODE_TYPES = {
  landingFlowNode: LandingFlowNode,
};

const LandingFlowCanvasInner = () => {
  const { fitView } = useReactFlow();
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const pickerTriggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    const root = demoContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setDemoActive(entry?.isIntersecting ?? false),
      { threshold: 0.2 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const handleOptionRef = useCallback((index: number, element: HTMLLIElement | null) => {
    optionRefs.current[index] = element;
  }, []);

  const {
    flow,
    flowIndex,
    nodes,
    edges,
    menuOpen,
    highlightedOption,
    cursorPosition,
    isClicking,
    isCanvasFading,
  } = useLandingFlowDemo({
    containerRef: demoContainerRef,
    triggerRef: pickerTriggerRef,
    optionRefs,
    isActive: demoActive,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fitView({ padding: 0.12, duration: 380 });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [flowIndex, fitView]);

  return (
    <div ref={demoContainerRef} className="relative flex min-h-0 flex-1 flex-col">
      <div className="relative flex w-full items-center justify-between gap-4 border-b border-border/50 px-6 py-4">
        <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant transition-opacity duration-500">
          {flow.figLabel}
          <span className="ml-2 text-on-surface-variant/50">
            {flowIndex + 1}/{LANDING_FLOWS.length}
          </span>
        </span>

        <LandingFlowPicker
          flowIndex={flowIndex}
          menuOpen={menuOpen}
          highlightedOption={highlightedOption}
          triggerRef={pickerTriggerRef}
          onOptionRef={handleOptionRef}
        />

        <span className="rounded-full bg-success/15 px-2.5 py-1 font-manrope text-[10px] font-bold text-success">
          live
        </span>
      </div>

      <div
        className={`landing-flow-stage relative min-h-0 flex-1 transition-opacity duration-450 ease-out ${
          isCanvasFading ? "opacity-[0.88]" : "opacity-100"
        }`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
          minZoom={0.45}
          maxZoom={0.85}
          defaultViewport={{ x: 0, y: 0, zoom: 0.72 }}
          className="h-full! w-full! bg-transparent!"
        >
          <Background
            id="landing-flow-dots"
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.4}
            color="var(--flow-pattern-dot)"
          />
        </ReactFlow>
      </div>

      <LandingFlowCursor
        position={cursorPosition}
        isClicking={isClicking}
        visible
      />

      <ul
        className={`relative shrink-0 space-y-2.5 border-t border-border/50 bg-surface-variant/25 p-5 font-manrope text-[11px] leading-relaxed text-on-surface-variant transition-opacity duration-450 ease-out ${
          isCanvasFading ? "opacity-[0.88]" : "opacity-100"
        }`}
      >
        {flow.logLines.map((line) => (
          <li key={`${flow.id}-${line.time}`}>
            <span className="font-bold text-secondary">{line.time}</span>{" "}
            {line.message}
          </li>
        ))}
      </ul>

      <div className="sr-only" aria-live="polite" aria-atomic>
        Showing workflow example {flowIndex + 1} of {LANDING_FLOWS.length}:{" "}
        {flow.figLabel}
      </div>
    </div>
  );
};

export const LandingWorkflowCanvas = () => (
  <aside
    className="landing-blueprint relative hidden min-h-0 w-full min-w-0 bg-surface-container-low lg:flex lg:h-full lg:min-h-0 lg:flex-col"
    aria-label="Workflow canvas preview"
  >
    <div className="relative flex min-h-128 w-full flex-1 flex-col overflow-hidden bg-surface-container-low lg:min-h-0 lg:border-l lg:border-border/50">
      <div className="landing-flow-canvas relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-card">
        <div className="landing-blueprint-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="landing-canvas-dots pointer-events-none absolute inset-0" aria-hidden />

        <ReactFlowProvider>
          <LandingFlowCanvasInner />
        </ReactFlowProvider>
      </div>
    </div>
  </aside>
);

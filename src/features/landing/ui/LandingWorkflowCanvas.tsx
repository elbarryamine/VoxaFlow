"use client";

import { useEffect } from "react";
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

const NODE_TYPES = {
  landingFlowNode: LandingFlowNode,
};

const LandingFlowCanvasInner = () => {
  const { fitView } = useReactFlow();
  const {
    flow,
    flowIndex,
    nodes,
    edges,
    activeNodeId,
    isTransitioning,
  } = useLandingFlowDemo();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fitView({ padding: 0.12, duration: 520 });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [flowIndex, fitView]);

  return (
    <>
      <div className="relative flex w-full items-start justify-between border-b border-border/50 px-6 py-4">
        <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant transition-opacity duration-500">
          {flow.figLabel}
          <span className="ml-2 text-on-surface-variant/50">
            {flowIndex + 1}/{LANDING_FLOWS.length}
          </span>
        </span>
        <span className="rounded-full bg-success/15 px-2.5 py-1 font-manrope text-[10px] font-bold text-success">
          live
        </span>
      </div>

      <div
        className={`landing-flow-stage relative min-h-0 flex-1 transition-opacity duration-500 ${
          isTransitioning ? "opacity-40" : "opacity-100"
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
          preventScrolling
          proOptions={{ hideAttribution: true }}
          fitView
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

        <LandingFlowCursor
          targetNodeId={activeNodeId}
          visible={!isTransitioning}
        />
      </div>

      <ul
        key={flow.id}
        className="landing-flow-log relative shrink-0 space-y-2.5 border-t border-border/50 bg-surface-variant/25 p-5 font-manrope text-[11px] leading-relaxed text-on-surface-variant"
      >
        {flow.logLines.map((line) => (
          <li key={`${flow.id}-${line.time}`}>
            <span className="font-bold text-secondary">{line.time}</span>{" "}
            {line.message}
          </li>
        ))}
      </ul>

      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic
      >
        Showing workflow example {flowIndex + 1} of {LANDING_FLOWS.length}:{" "}
        {flow.figLabel}
      </div>
    </>
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

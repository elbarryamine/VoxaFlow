"use client";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { WorkflowNode } from "./WorkflowNode";
import { NodePalette } from "./NodePalette";
import { NodeConfigSidebar } from "./NodeConfigSidebar";
import { useWorkflowCanvas } from "../hooks/useWorkflowCanvas";
import { Plus } from "@phosphor-icons/react/dist/ssr";

const NODE_TYPES = {
  workflowNode: WorkflowNode,
};

const CanvasInner = () => {
  const {
    reactFlowWrapper,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragStart,
    onAddNode,
    onDragOver,
    onDrop,
    selectedNode,
    onNodeClick,
    onPaneClick,
    onUpdateSelectedNode,
    isPaletteOpen,
    setIsPaletteOpen,
  } = useWorkflowCanvas();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Main Flow Canvas */}
      <div
        ref={reactFlowWrapper}
        className="relative h-full w-full"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={NODE_TYPES}
          fitView
          className="h-full"
        >
          <Background
            id="canvas-pattern-dots"
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.4}
            color="var(--flow-pattern-dot)"
          />
          <Controls
            showInteractive={false}
            className="rounded-xl! border-border! bg-card! shadow-lg!"
          />
          <MiniMap
            className="rounded-xl! border-border! bg-card!"
            nodeColor="#6366f1"
            maskColor="var(--flow-minimap-mask)"
          />
        </ReactFlow>

        {/* Empty Canvas Placeholder */}
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="pointer-events-auto flex h-32 w-32 flex-col items-center justify-center gap-4 rounded-3xl border-4 border-dashed border-border/60 bg-background/50 text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-xl backdrop-blur-sm"
            >
              <Plus weight="bold" className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">Add Node</span>
            </button>
          </div>
        )}
      </div>

      <div
        className={`pointer-events-none absolute bottom-4 right-4 top-4 z-40 w-72 transform transition-transform duration-500 ease-in-out ${
          isPaletteOpen ? "translate-x-0" : "translate-x-[150%]"
        }`}
      >
        <div className="pointer-events-auto h-full w-full">
          <NodePalette onDragStart={onDragStart} onAdd={onAddNode} />
        </div>
      </div>

      <div
        className={`pointer-events-none absolute bottom-4 right-4 top-4 z-50 w-[340px] transform transition-transform duration-500 ease-in-out ${
          selectedNode ? "translate-x-0" : "translate-x-[150%]"
        }`}
      >
        <div className="pointer-events-auto h-full w-full">
          <NodeConfigSidebar
            node={selectedNode}
            nodes={nodes}
            edges={edges}
            onUpdateNode={onUpdateSelectedNode}
            onClose={onPaneClick}
          />
        </div>
      </div>
    </div>
  );
};

export const WorkflowCanvas = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};

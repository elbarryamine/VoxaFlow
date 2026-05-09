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
import { Plus, MagicWand, Trash, Copy } from "@phosphor-icons/react/dist/ssr";
import { ConfirmationModal } from "@/src/shared/ui/ConfirmationModal";
import { TemplatesModal } from "./TemplatesModal";

const NODE_TYPES = {
  workflowNode: WorkflowNode,
};

const CanvasInner = () => {
  const {
    reactFlowWrapper,
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragStart,
    onAddNode,
    formatWorkflow,
    clearWorkflow,
    confirmClear,
    isClearModalOpen,
    setIsClearModalOpen,
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
    onDragOver,
    onDrop,
    onNodeClick,
    onPaneClick,
    onUpdateSelectedNode,
    isPaletteOpen,
    setIsPaletteOpen,
    sourceNodeIdForAdd,
    targetNodeIdForAdd,
  } = useWorkflowCanvas();

  return (
    <div className="px-5  relative flex h-full w-full">
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-transparent dark:border-border bg-background/50 dark:bg-background/50 shadow-sm backdrop-blur-md">
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={NODE_TYPES}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
            className="rounded-lg! border-border! bg-background! shadow-sm!"
          />
          <MiniMap
            className="rounded-lg! border-border! bg-background!"
            nodeColor="#6366f1"
            maskColor="var(--flow-minimap-mask)"
          />
        </ReactFlow>

        {/* Empty Canvas Placeholder */}
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="pointer-events-auto flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Plus weight="bold" className="h-5 w-5" />
              <span className="text-[11px] font-medium">Add Node</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Node Palette Panel */}
      <div
        className={`pointer-events-none absolute bottom-4 right-4 top-4 z-40 w-72 transform transition-transform duration-500 ease-in-out ${
          isPaletteOpen ? "translate-x-0" : "translate-x-[150%]"
        }`}
      >
        <div className="pointer-events-auto h-full w-full">
          <NodePalette 
            onDragStart={onDragStart} 
            onAdd={onAddNode} 
            hasNodes={nodes.length > 0} 
            sourceNodeId={sourceNodeIdForAdd}
            targetNodeId={targetNodeIdForAdd}
          />
        </div>
      </div>

      {/* Floating Config Sidebar Panel */}
      <div
        className={`pointer-events-none absolute bottom-4 right-4 top-4 z-50 w-[480px] transform transition-transform duration-500 ease-in-out ${
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

      {/* Floating Controls Area */}
      <div className="absolute left-6 top-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsTemplatesModalOpen(true)}
          className="flex h-8 items-center gap-2 rounded border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <Copy weight="bold" className="h-3.5 w-3.5" />
          Start from template
        </button>

        <button
          onClick={() => formatWorkflow()}
          className="flex h-8 items-center gap-2 rounded border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <MagicWand weight="bold" className="h-3.5 w-3.5" />
          Format
        </button>

        <button
          onClick={() => clearWorkflow()}
          className="flex h-8 items-center gap-2 rounded border border-border bg-background px-3 text-xs font-medium text-red-500 hover:bg-secondary transition-colors"
        >
          <Trash weight="bold" className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmClear}
        title="Clear Workflow"
        message="Are you sure you want to clear the entire workflow? This action cannot be undone."
        confirmText="Clear Everything"
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelect={(id) => console.log("Template selected:", id)}
      />
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

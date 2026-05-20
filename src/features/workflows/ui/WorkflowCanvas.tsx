"use client";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { WorkflowNode } from "./WorkflowNode";
import { NodePalette } from "./NodePalette";
import { NodeConfigSidebar } from "./NodeConfigSidebar";
import { useWorkflowCanvas } from "../hooks/useWorkflowCanvas";
import { ConfirmationModal } from "@/src/shared/ui/ConfirmationModal";
import { TemplatesModal } from "./TemplatesModal";
import { CanvasControls } from "./CanvasControls";
import { EmptyCanvasPlaceholder } from "./EmptyCanvasPlaceholder";
import { WorkflowActions } from "./WorkflowActions";

import type { Workflow, WorkflowDefinition } from "../types/Workflow.types";

const NODE_TYPES = {
  workflowNode: WorkflowNode,
};

interface WorkflowCanvasProps {
  initialWorkflow?: Workflow;
  onSave?: (definition: WorkflowDefinition) => void;
}

const CanvasInner = ({ initialWorkflow, onSave }: WorkflowCanvasProps) => {
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
    showMiniMap,
    setShowMiniMap,
  } = useWorkflowCanvas(initialWorkflow, onSave);

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
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        >
          <Background
            id="canvas-pattern-dots"
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.4}
            color="var(--flow-pattern-dot)"
          />
          <CanvasControls showMiniMap={showMiniMap} setShowMiniMap={setShowMiniMap} />
          {showMiniMap && (
            <MiniMap
              className="rounded-lg! border-border! bg-background/80! backdrop-blur-md! shadow-sm!"
              nodeColor="var(--primary)"
              maskColor="var(--flow-minimap-mask)"
              maskStrokeWidth={1}
              style={{ height: 100, width: 160 }}
            />
          )}
        </ReactFlow>

        {/* Empty Canvas Placeholder */}
        {nodes.length === 0 && (
          <EmptyCanvasPlaceholder onClick={() => setIsPaletteOpen(true)} />
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
            onAdd={onAddNode} 
            onDragStart={onDragStart}
            isDraggable={true}
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
      <WorkflowActions 
        onStartFromTemplate={() => setIsTemplatesModalOpen(true)}
        onFormat={formatWorkflow}
        onClear={clearWorkflow}
        onTogglePalette={() => setIsPaletteOpen(!isPaletteOpen)}
        isPaletteOpen={isPaletteOpen}
      />

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

export const WorkflowCanvas = (props: WorkflowCanvasProps) => {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
};

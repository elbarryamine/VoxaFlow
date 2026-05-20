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
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-surface-container-lowest">
        <WorkflowActions
          onStartFromTemplate={() => setIsTemplatesModalOpen(true)}
          onFormat={formatWorkflow}
          onClear={clearWorkflow}
          onTogglePalette={() => setIsPaletteOpen(!isPaletteOpen)}
          isPaletteOpen={isPaletteOpen}
        />

        <div className="flex min-h-0 flex-1">
          <div className="relative min-h-0 min-w-0 flex-1" ref={reactFlowWrapper}>
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
            className="bg-transparent!"
          >
            <Background
              id="canvas-pattern-dots"
              variant={BackgroundVariant.Dots}
              gap={22}
              size={1.4}
              color="var(--flow-pattern-dot)"
            />
            {showMiniMap && (
              <MiniMap
                className="rounded-sm! overflow-hidden border-border/50! bg-surface-container-low/95! shadow-sm! backdrop-blur-sm!"
                nodeColor="var(--primary)"
                maskColor="var(--flow-minimap-mask)"
                maskStrokeWidth={1}
                style={{ height: 96, width: 152, bottom: 56, right: 16 }}
              />
            )}
          </ReactFlow>

          <CanvasControls
            showMiniMap={showMiniMap}
            setShowMiniMap={setShowMiniMap}
          />

          {nodes.length === 0 && (
            <EmptyCanvasPlaceholder onClick={() => setIsPaletteOpen(true)} />
          )}
          </div>

          <aside
            className={`flex shrink-0 flex-col overflow-hidden border-l border-border/50 bg-card transition-[width] duration-300 ease-in-out ${
              isPaletteOpen && !selectedNode ? "w-72" : "w-0"
            }`}
            aria-hidden={!isPaletteOpen || !!selectedNode}
          >
            {isPaletteOpen && !selectedNode && (
              <NodePalette
                onAdd={onAddNode}
                onDragStart={onDragStart}
                isDraggable={true}
                hasNodes={nodes.length > 0}
                sourceNodeId={sourceNodeIdForAdd}
                targetNodeId={targetNodeIdForAdd}
              />
            )}
          </aside>

          <aside
            className={`flex shrink-0 flex-col overflow-hidden border-l border-border/50 bg-card transition-[width] duration-300 ease-in-out ${
              selectedNode ? "w-[480px]" : "w-0"
            }`}
            aria-hidden={!selectedNode}
          >
            {selectedNode && (
              <NodeConfigSidebar
                key={selectedNode.id}
                node={selectedNode}
                nodes={nodes}
                edges={edges}
                onUpdateNode={onUpdateSelectedNode}
                onClose={onPaneClick}
              />
            )}
          </aside>
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
  );
};

export const WorkflowCanvas = (props: WorkflowCanvasProps) => {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
};

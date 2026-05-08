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
    onDragOver,
    onDrop,
    selectedNode,
    onNodeClick,
    onPaneClick,
    onUpdateSelectedNode,
  } = useWorkflowCanvas();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 overflow-hidden px-8 gap-2">
        <NodePalette onDragStart={onDragStart} />

        <div
          ref={reactFlowWrapper}
          className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border"
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
            className="h-full bg-background"
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
        </div>

        <NodeConfigSidebar
          node={selectedNode}
          nodes={nodes}
          edges={edges}
          onUpdateNode={onUpdateSelectedNode}
          onClose={onPaneClick}
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

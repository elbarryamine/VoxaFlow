"use client";

import { useRef } from "react";
import { type OnConnect, addEdge } from "@xyflow/react";
import { useCallback } from "react";

import type { Workflow, WorkflowDefinition } from "../types/Workflow.types";
import { useWorkflowState } from "./useWorkflowState";
import { useWorkflowInteractions } from "./useWorkflowInteractions";
import { useWorkflowPalette } from "./useWorkflowPalette";
import { useWorkflowEvents } from "./useWorkflowEvents";
import { useWorkflowUtilities } from "./useWorkflowUtilities";

const DASHED_EDGE_STYLE = {
  strokeDasharray: "6 4",
};

const getConditionBranchLabel = (sourceHandle: string | null | undefined) => {
  if (sourceHandle === "yes") return "Yes";
  if (sourceHandle === "no") return "No";
  return undefined;
};

export const useWorkflowCanvas = (initialWorkflow?: Workflow, onSave?: (definition: WorkflowDefinition) => void) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // 1. Core State
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } = useWorkflowState(initialWorkflow);

  // 2. Interactions (Selection, Updating)
  const { 
    selectedNode, 
    setSelectedNodeId, 
    onNodeClick, 
    onPaneClick, 
    onUpdateSelectedNode 
  } = useWorkflowInteractions(nodes, setNodes);

  // 3. Palette & Node Addition
  const {
    isPaletteOpen,
    setIsPaletteOpen,
    sourceNodeIdForAdd,
    setSourceNodeIdForAdd,
    setSourceHandleForAdd,
    targetNodeIdForAdd,
    setTargetNodeIdForAdd,
    setTargetHandleForAdd,
    onDragStart,
    onDragOver,
    onAddNode,
    onDrop,
  } = useWorkflowPalette(nodes, setNodes, setEdges, reactFlowWrapper);

  // 4. Custom Events & Persistence Bridge
  useWorkflowEvents({
    nodes,
    edges,
    onSave,
    callbacks: {
      setIsPaletteOpen,
      setSourceNodeIdForAdd,
      setSourceHandleForAdd,
      setTargetNodeIdForAdd,
      setTargetHandleForAdd,
      setSelectedNodeId,
    },
  });

  // 5. Utilities (Formatting, Clearing, etc.)
  const {
    showMiniMap,
    setShowMiniMap,
    isClearModalOpen,
    setIsClearModalOpen,
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
    formatWorkflow,
    confirmClear,
    clearWorkflow,
  } = useWorkflowUtilities(
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    setSelectedNodeId, 
    setIsPaletteOpen, 
    setSourceNodeIdForAdd
  );

  // 6. Connections logic (shared by multiple hooks but kept here for React Flow consistency)
  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: DASHED_EDGE_STYLE,
            label: getConditionBranchLabel(params.sourceHandle),
          },
          eds,
        ),
      ),
    [setEdges],
  );

  return {
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
    onDragOver,
    onDrop,
    onNodeClick,
    onPaneClick,
    onUpdateSelectedNode,
    isPaletteOpen,
    setIsPaletteOpen,
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
    sourceNodeIdForAdd,
    targetNodeIdForAdd,
    showMiniMap,
    setShowMiniMap,
  };
};

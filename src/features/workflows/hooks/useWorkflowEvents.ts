"use client";

import { useEffect, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowNodeData } from "../types/Workflow.types";

export const useWorkflowEvents = ({
  nodes,
  edges,
  onSave,
  callbacks,
}: {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onSave?: (definition: { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }) => void;
  callbacks: {
    setIsPaletteOpen: (open: boolean) => void;
    setSourceNodeIdForAdd: (id: string | null) => void;
    setSourceHandleForAdd: (handle: string | null) => void;
    setTargetNodeIdForAdd: (id: string | null) => void;
    setTargetHandleForAdd: (handle: string | null) => void;
    setSelectedNodeId: (id: string | null) => void;
  };
}) => {
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    onSaveRef.current = onSave;
  }, [nodes, edges, onSave]);

  useEffect(() => {
    const handleOpenPalette = (e: Event) => {
      const customEvent = e as CustomEvent<{
        sourceNodeId?: string | null;
        sourceHandle?: string | null;
        targetNodeId?: string | null;
        targetHandle?: string | null;
      }>;
      callbacks.setIsPaletteOpen(true);
      callbacks.setSourceNodeIdForAdd(customEvent.detail?.sourceNodeId || null);
      callbacks.setSourceHandleForAdd(customEvent.detail?.sourceHandle || null);
      callbacks.setTargetNodeIdForAdd(customEvent.detail?.targetNodeId || null);
      callbacks.setTargetHandleForAdd(customEvent.detail?.targetHandle || null);
      callbacks.setSelectedNodeId(null);
    };

    const handleClosePalette = () => {
      callbacks.setIsPaletteOpen(false);
      callbacks.setSourceNodeIdForAdd(null);
      callbacks.setSourceHandleForAdd(null);
      callbacks.setTargetNodeIdForAdd(null);
      callbacks.setTargetHandleForAdd(null);
    };

    const handleOpenConfig = (e: Event) => {
      const customEvent = e as CustomEvent<{ nodeId: string }>;
      callbacks.setSelectedNodeId(customEvent.detail?.nodeId || null);
      callbacks.setIsPaletteOpen(false);
      callbacks.setSourceNodeIdForAdd(null);
    };

    const handleSaveTrigger = () => {
      if (onSaveRef.current) {
        onSaveRef.current({ 
          nodes: nodesRef.current, 
          edges: edgesRef.current 
        });
      }
    };

    window.addEventListener("open-node-palette", handleOpenPalette);
    window.addEventListener("close-node-palette", handleClosePalette);
    window.addEventListener("open-node-config", handleOpenConfig);
    window.addEventListener("save-workflow-trigger", handleSaveTrigger);

    return () => {
      window.removeEventListener("open-node-palette", handleOpenPalette);
      window.removeEventListener("close-node-palette", handleClosePalette);
      window.removeEventListener("open-node-config", handleOpenConfig);
      window.removeEventListener("save-workflow-trigger", handleSaveTrigger);
    };
  }, [callbacks]);
};

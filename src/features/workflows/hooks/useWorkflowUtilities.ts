"use client";

import { useCallback, useState } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowNodeData } from "../types/Workflow.types";

export const useWorkflowUtilities = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node<WorkflowNodeData>[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  setSelectedNodeId: (id: string | null) => void,
  setIsPaletteOpen: (open: boolean) => void,
  setSourceNodeIdForAdd: (id: string | null) => void
) => {
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const formatWorkflow = useCallback(() => {
    const nodeLevels: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    nodes.forEach((n) => {
      adj[n.id] = [];
      inDegree[n.id] = 0;
    });

    edges.forEach((e) => {
      if (adj[e.source]) adj[e.source].push(e.target);
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    });

    const queue: string[] = [];
    nodes.forEach((n) => {
      if (inDegree[n.id] === 0) {
        queue.push(n.id);
        nodeLevels[n.id] = 0;
      }
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      const level = nodeLevels[u];

      adj[u].forEach((v) => {
        if (nodeLevels[v] === undefined || nodeLevels[v] < level + 1) {
          nodeLevels[v] = level + 1;
          queue.push(v);
        }
      });
    }

    const levels: Record<number, string[]> = {};
    nodes.forEach((n) => {
      const level = nodeLevels[n.id] || 0;
      if (!levels[level]) levels[level] = [];
      levels[level].push(n.id);
    });

    const HORIZONTAL_SPACING = 350;
    const VERTICAL_SPACING = 150;

    const positionedNodes = nodes.map((n) => {
      const level = nodeLevels[n.id] || 0;
      const indexInLevel = levels[level].indexOf(n.id);
      const levelSize = levels[level].length;

      return {
        ...n,
        position: {
          x: level * HORIZONTAL_SPACING + 100,
          y: (indexInLevel - (levelSize - 1) / 2) * VERTICAL_SPACING + 300,
        },
      };
    });

    setNodes(positionedNodes);
  }, [nodes, edges, setNodes]);

  const confirmClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setIsPaletteOpen(false);
    setSourceNodeIdForAdd(null);
    setIsClearModalOpen(false);
  }, [setNodes, setEdges, setSelectedNodeId, setIsPaletteOpen, setSourceNodeIdForAdd]);

  const clearWorkflow = useCallback(() => {
    setIsClearModalOpen(true);
  }, []);

  return {
    showMiniMap,
    setShowMiniMap,
    isClearModalOpen,
    setIsClearModalOpen,
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
    formatWorkflow,
    confirmClear,
    clearWorkflow,
  };
};

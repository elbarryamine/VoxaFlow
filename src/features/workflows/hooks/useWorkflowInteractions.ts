"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import type { Node } from "@xyflow/react";
import type { WorkflowNodeData, WorkflowNodeDataValue } from "../types/Workflow.types";

export const useWorkflowInteractions = (
  nodes: Node<WorkflowNodeData>[],
  setNodes: React.Dispatch<React.SetStateAction<Node<WorkflowNodeData>[]>>
) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const onNodeClick = useCallback(
    (_: any, node: Node<WorkflowNodeData>) => {
      setSelectedNodeId(node.id);
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onUpdateSelectedNode = useCallback(
    (field: string, value: WorkflowNodeDataValue) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  [field]: value,
                },
              }
            : node,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  // Sync selection if node is deleted
  useEffect(() => {
    if (!selectedNodeId) return;
    const hasNode = nodes.some((node) => node.id === selectedNodeId);
    if (!hasNode) {
      setSelectedNodeId(null);
    }
  }, [nodes, selectedNodeId]);

  return {
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    onNodeClick,
    onPaneClick,
    onUpdateSelectedNode,
  };
};

"use client";

import { useCallback, useRef, useState } from "react";
import { addEdge, type Node, type Edge, useReactFlow } from "@xyflow/react";
import type { WorkflowNodeData } from "../types/Workflow.types";
import type { NodeTemplate } from "../constants/NODE_TEMPLATES";
import { getNextNodeId } from "./useWorkflowState";

const DASHED_EDGE_STYLE = {
  strokeDasharray: "6 4",
};

const getConditionBranchLabel = (sourceHandle: string | null | undefined) => {
  if (sourceHandle === "yes") return "Yes";
  if (sourceHandle === "no") return "No";
  return undefined;
};

export const useWorkflowPalette = (
  nodes: Node<WorkflowNodeData>[],
  setNodes: React.Dispatch<React.SetStateAction<Node<WorkflowNodeData>[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  reactFlowWrapper: React.RefObject<HTMLDivElement | null>
) => {
  const { screenToFlowPosition } = useReactFlow();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [sourceNodeIdForAdd, setSourceNodeIdForAdd] = useState<string | null>(null);
  const [sourceHandleForAdd, setSourceHandleForAdd] = useState<string | null>(null);
  const [targetNodeIdForAdd, setTargetNodeIdForAdd] = useState<string | null>(null);
  const [targetHandleForAdd, setTargetHandleForAdd] = useState<string | null>(null);
  const draggedTemplate = useRef<NodeTemplate | null>(null);

  const onDragStart = useCallback((template: NodeTemplate) => {
    draggedTemplate.current = template;
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onAddNode = useCallback(
    (template: NodeTemplate) => {
      if (!reactFlowWrapper.current) return;

      let position;

      if (sourceNodeIdForAdd) {
        const sourceNode = nodes.find((n) => n.id === sourceNodeIdForAdd);
        if (sourceNode) {
          position = {
            x: sourceNode.position.x + 350,
            y: sourceNode.position.y,
          };
        }
      } else if (targetNodeIdForAdd) {
        const targetNode = nodes.find((n) => n.id === targetNodeIdForAdd);
        if (targetNode) {
          position = {
            x: targetNode.position.x - 350,
            y: targetNode.position.y,
          };
        }
      }

      if (!position) {
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        position = screenToFlowPosition({
          x: centerX,
          y: centerY,
        });
      }

      const newNodeId = getNextNodeId();

      const newNode: Node<WorkflowNodeData> = {
        id: newNodeId,
        type: "workflowNode",
        position,
        data: {
          label: template.label,
          type: template.type,
          description: template.description,
          configured: false,
        },
      };

      setNodes((nds) => [...nds, newNode]);

      if (sourceNodeIdForAdd) {
        setEdges((eds) => {
          const sourceNode = nodes.find((n) => n.id === sourceNodeIdForAdd);
          const isCondition = sourceNode?.data?.outputFormat === "branch";
          const sourceHandle = sourceHandleForAdd || (isCondition ? "yes" : undefined);
          
          return addEdge(
            {
              id: `e-${sourceNodeIdForAdd}-${newNode.id}`,
              source: sourceNodeIdForAdd,
              target: newNode.id,
              sourceHandle,
              targetHandle: undefined,
              animated: true,
              style: DASHED_EDGE_STYLE,
              label: getConditionBranchLabel(sourceHandle),
            },
            eds,
          );
        });
      } else if (targetNodeIdForAdd) {
        setEdges((eds) => {
          return addEdge(
            {
              id: `e-${newNode.id}-${targetNodeIdForAdd}`,
              source: newNode.id,
              target: targetNodeIdForAdd,
              sourceHandle: undefined,
              targetHandle: targetHandleForAdd || undefined,
              animated: true,
              style: DASHED_EDGE_STYLE,
            },
            eds,
          );
        });
      }

      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
      setSourceHandleForAdd(null);
      setTargetNodeIdForAdd(null);
      setTargetHandleForAdd(null);
      
      return newNode.id;
    },
    [screenToFlowPosition, setNodes, sourceNodeIdForAdd, sourceHandleForAdd, targetNodeIdForAdd, targetHandleForAdd, nodes, setEdges, reactFlowWrapper]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const template = draggedTemplate.current;
      if (!template || !reactFlowWrapper.current) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<WorkflowNodeData> = {
        id: getNextNodeId(),
        type: "workflowNode",
        position,
        data: {
          label: template.label,
          type: template.type,
          description: template.description,
          configured: false,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      
      if (sourceNodeIdForAdd) {
        setEdges((eds) => {
          const sourceNode = nodes.find((n) => n.id === sourceNodeIdForAdd);
          const isCondition = sourceNode?.data?.outputFormat === "branch";
          const sourceHandle = sourceHandleForAdd || (isCondition ? "yes" : undefined);
          
          return addEdge(
            {
              id: `e-${sourceNodeIdForAdd}-${newNode.id}`,
              source: sourceNodeIdForAdd,
              target: newNode.id,
              sourceHandle,
              targetHandle: undefined,
              animated: true,
              style: DASHED_EDGE_STYLE,
              label: getConditionBranchLabel(sourceHandle),
            },
            eds,
          );
        });
      }

      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
      setSourceHandleForAdd(null);
      setTargetNodeIdForAdd(null);
      setTargetHandleForAdd(null);
      draggedTemplate.current = null;
      
      return newNode.id;
    },
    [screenToFlowPosition, setNodes, sourceNodeIdForAdd, sourceHandleForAdd, nodes, setEdges, reactFlowWrapper]
  );

  return {
    isPaletteOpen,
    setIsPaletteOpen,
    sourceNodeIdForAdd,
    setSourceNodeIdForAdd,
    sourceHandleForAdd,
    setSourceHandleForAdd,
    targetNodeIdForAdd,
    setTargetNodeIdForAdd,
    targetHandleForAdd,
    setTargetHandleForAdd,
    onDragStart,
    onDragOver,
    onAddNode,
    onDrop,
  };
};

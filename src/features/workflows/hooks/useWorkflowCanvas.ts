"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Node,
  type Edge,
  type OnConnect,
  type NodeMouseHandler,
} from "@xyflow/react";
import type {
  WorkflowNodeData,
  WorkflowNodeDataValue,
} from "../types/Workflow.types";
import type { NodeTemplate } from "../constants/NODE_TEMPLATES";

const DASHED_EDGE_STYLE = {
  strokeDasharray: "6 4",
};

const getConditionBranchLabel = (sourceHandle: string | null | undefined) => {
  if (sourceHandle === "yes") return "Yes";
  if (sourceHandle === "no") return "No";
  return undefined;
};

const INITIAL_NODES: Node<WorkflowNodeData>[] = [];
const INITIAL_EDGES: Edge[] = [];

let nodeIdCounter = 10;

export const useWorkflowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [sourceNodeIdForAdd, setSourceNodeIdForAdd] = useState<string | null>(null);
  const [sourceHandleForAdd, setSourceHandleForAdd] = useState<string | null>(null);
  const [targetNodeIdForAdd, setTargetNodeIdForAdd] = useState<string | null>(null);
  const [targetHandleForAdd, setTargetHandleForAdd] = useState<string | null>(null);
  const draggedTemplate = useRef<NodeTemplate | null>(null);
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  useEffect(() => {
    const handleOpenPalette = (e: any) => {
      setIsPaletteOpen(true);
      setSourceNodeIdForAdd(e?.detail?.sourceNodeId || null);
      setSourceHandleForAdd(e?.detail?.sourceHandle || null);
      setTargetNodeIdForAdd(e?.detail?.targetNodeId || null);
      setTargetHandleForAdd(e?.detail?.targetHandle || null);
      setSelectedNodeId(null);
    };
    const handleClosePalette = () => {
      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
      setSourceHandleForAdd(null);
      setTargetNodeIdForAdd(null);
      setTargetHandleForAdd(null);
    };
    const handleOpenConfig = (e: any) => {
      setSelectedNodeId(e.detail.nodeId);
      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
    };

    window.addEventListener("open-node-palette", handleOpenPalette);
    window.addEventListener("close-node-palette", handleClosePalette);
    window.addEventListener("open-node-config", handleOpenConfig);

    return () => {
      window.removeEventListener("open-node-palette", handleOpenPalette);
      window.removeEventListener("close-node-palette", handleClosePalette);
      window.removeEventListener("open-node-config", handleOpenConfig);
    };
  }, []);

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

  const onDragStart = useCallback((template: NodeTemplate) => {
    draggedTemplate.current = template;
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick: NodeMouseHandler<Node<WorkflowNodeData>> = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setIsPaletteOpen(false);
    setSourceNodeIdForAdd(null);
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
        id: String(++nodeIdCounter),
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
          const sourceHandle = isCondition ? "yes" : undefined;
          
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

      setSelectedNodeId(newNode.id);
      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
      setSourceHandleForAdd(null);
      setTargetNodeIdForAdd(null);
      setTargetHandleForAdd(null);
      draggedTemplate.current = null;
    },
    [screenToFlowPosition, setNodes, sourceNodeIdForAdd, sourceHandleForAdd, targetNodeIdForAdd, targetHandleForAdd, nodes, setEdges],
  );

  useEffect(() => {
    if (!selectedNodeId) return;
    const hasNode = nodes.some((node) => node.id === selectedNodeId);
    if (!hasNode) {
      setSelectedNodeId(null);
    }
  }, [nodes, selectedNodeId]);

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

      const newNode: Node<WorkflowNodeData> = {
        id: String(++nodeIdCounter),
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

      setSelectedNodeId(newNode.id);
      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
      setSourceHandleForAdd(null);
      setTargetNodeIdForAdd(null);
      setTargetHandleForAdd(null);
    },
    [screenToFlowPosition, setNodes, sourceNodeIdForAdd, sourceHandleForAdd, targetNodeIdForAdd, targetHandleForAdd, nodes, setEdges],
  );

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

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const confirmClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setIsPaletteOpen(false);
    setSourceNodeIdForAdd(null);
    setIsClearModalOpen(false);
  }, [setNodes, setEdges]);

  const clearWorkflow = useCallback(() => {
    setIsClearModalOpen(true);
  }, []);

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
  };
};

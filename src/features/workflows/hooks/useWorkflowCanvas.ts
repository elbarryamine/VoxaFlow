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
  const draggedTemplate = useRef<NodeTemplate | null>(null);
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  useEffect(() => {
    const handleOpenPalette = (e: any) => {
      setIsPaletteOpen(true);
      setSourceNodeIdForAdd(e?.detail?.sourceNodeId || null);
      setSelectedNodeId(null);
    };
    const handleClosePalette = () => {
      setIsPaletteOpen(false);
      setSourceNodeIdForAdd(null);
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
      draggedTemplate.current = null;
    },
    [screenToFlowPosition, setNodes, sourceNodeIdForAdd, nodes, setEdges],
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
    },
    [screenToFlowPosition, setNodes, sourceNodeIdForAdd, nodes, setEdges],
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
    onDragOver,
    onDrop,
    onNodeClick,
    onPaneClick,
    onUpdateSelectedNode,
    isPaletteOpen,
    setIsPaletteOpen,
  };
};

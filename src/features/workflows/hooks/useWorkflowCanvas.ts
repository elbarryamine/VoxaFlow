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

const INITIAL_NODES: Node<WorkflowNodeData>[] = [
  {
    id: "1",
    type: "workflowNode",
    position: { x: 300, y: 50 },
    data: {
      label: "Webhook Trigger",
      type: "webhook-custom",
      description: "Trigger from external event",
      agentId: "agent-1",
      agentName: "Sales Qualifier",
    },
  },
  {
    id: "2",
    type: "workflowNode",
    position: { x: 300, y: 200 },
    data: {
      label: "Lead Intent Model",
      type: "ai-custom-model",
      description: "Classify lead intent",
      modelName: "gpt-4.1",
    },
  },
  {
    id: "3",
    type: "workflowNode",
    position: { x: 150, y: 380 },
    data: {
      label: "Qualified?",
      type: "condition",
      description: "Route by qualification result",
      conditionType: "field",
      conditionField: "leadScore",
      conditionOperator: ">=",
      conditionValue: "70",
    },
  },
  {
    id: "4",
    type: "workflowNode",
    position: { x: 50, y: 550 },
    data: {
      label: "Log to Spreadsheet",
      type: "integration-spreadsheet",
      description: "Store lead record",
      spreadsheetId: "sales-leads",
    },
  },
  {
    id: "5",
    type: "workflowNode",
    position: { x: 350, y: 550 },
    data: {
      label: "Notify Sales Team",
      type: "integration-slack",
      description: "Send Slack notification",
      slackChannel: "#sales-alerts",
    },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: DASHED_EDGE_STYLE,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    style: DASHED_EDGE_STYLE,
  },
  {
    id: "e3-4",
    source: "3",
    sourceHandle: "no",
    target: "4",
    label: "No",
    animated: true,
    style: DASHED_EDGE_STYLE,
  },
  {
    id: "e3-5",
    source: "3",
    sourceHandle: "yes",
    target: "5",
    label: "Yes",
    animated: true,
    style: DASHED_EDGE_STYLE,
  },
];

let nodeIdCounter = 10;

export const useWorkflowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const draggedTemplate = useRef<NodeTemplate | null>(null);
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

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
      setSelectedNodeId(newNode.id);
      draggedTemplate.current = null;
    },
    [screenToFlowPosition, setNodes],
  );

  useEffect(() => {
    if (!selectedNodeId) return;
    const hasNode = nodes.some((node) => node.id === selectedNodeId);
    if (!hasNode) {
      setSelectedNodeId(null);
    }
  }, [nodes, selectedNodeId]);

  return {
    reactFlowWrapper,
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragStart,
    onDragOver,
    onDrop,
    onNodeClick,
    onPaneClick,
    onUpdateSelectedNode,
  };
};

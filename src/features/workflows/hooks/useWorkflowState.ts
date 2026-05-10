"use client";

import { useEffect, useRef } from "react";
import { useNodesState, useEdgesState, type Node, type Edge } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import type { Workflow, WorkflowNodeData } from "../types/Workflow.types";

const INITIAL_NODES: Node<WorkflowNodeData>[] = [];
const INITIAL_EDGES: Edge[] = [];

let nodeIdCounter = 10;

export const getNextNodeId = () => {
  nodeIdCounter++;
  return String(nodeIdCounter);
};

export const setNodeIdCounter = (val: number) => {
  nodeIdCounter = val;
};

export const useWorkflowState = (initialWorkflow?: Workflow) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  // Load initial workflow data only when the workflow ID changes or is first loaded
  useEffect(() => {
    if (initialWorkflow?.id && initialWorkflow?.definition) {
      const { nodes: initialNodes = [], edges: initialEdges = [] } = initialWorkflow.definition;
      setNodes(initialNodes);
      setEdges(initialEdges);
      
      // Reset counter to avoid ID collisions
      const maxId = Math.max(0, ...initialNodes.map((n: any) => parseInt(n.id) || 0));
      setNodeIdCounter(maxId);

      // Fit view after nodes are set
      if (initialNodes.length > 0) {
        requestAnimationFrame(() => {
          fitView({ padding: 0.2, duration: 400 });
        });
      }
    }
  }, [initialWorkflow?.id, setNodes, setEdges, fitView]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
  };
};

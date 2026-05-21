export type ExecutionNodeStepStatus =
  | "success"
  | "failed"
  | "running"
  | "pending"
  | "skipped";

export interface ExecutionNodeStep {
  nodeId: string;
  nodeType: string;
  label: string;
  status: ExecutionNodeStepStatus;
}

export interface Execution {
  id: string;
  workflowName: string;
  workflowId: string;
  status: "success" | "failed" | "running" | "waiting";
  duration: string;
  trigger: string;
  startedAt: string;
  nodePath: ExecutionNodeStep[];
  failedNodeId: string | null;
}

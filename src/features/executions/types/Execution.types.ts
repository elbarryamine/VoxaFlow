export interface Execution {
  id: string;
  workflowName: string;
  workflowId: string;
  status: "success" | "failed" | "running" | "waiting";
  duration: string;
  trigger: string;
  startedAt: string;
}

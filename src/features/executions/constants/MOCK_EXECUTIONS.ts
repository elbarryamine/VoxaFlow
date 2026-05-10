import type { Execution } from "../types/Execution.types";

export const MOCK_EXECUTIONS: Execution[] = [
  {
    id: "exec-1",
    workflowName: "Sales Lead Qualifier",
    workflowId: "wf-1",
    status: "success",
    duration: "12s",
    trigger: "Webhook",
    startedAt: "2026-05-10T14:30:00Z",
  },
  {
    id: "exec-2",
    workflowName: "Support Ticket Triage",
    workflowId: "wf-2",
    status: "success",
    duration: "4s",
    trigger: "Schedule",
    startedAt: "2026-05-10T14:25:00Z",
  },
  {
    id: "exec-3",
    workflowName: "Appointment Reminder",
    workflowId: "wf-3",
    status: "failed",
    duration: "1m 05s",
    trigger: "Webhook",
    startedAt: "2026-05-10T14:20:00Z",
  },
  {
    id: "exec-4",
    workflowName: "Survey Collector",
    workflowId: "wf-4",
    status: "running",
    duration: "—",
    trigger: "Manual",
    startedAt: "2026-05-10T14:40:00Z",
  },
];

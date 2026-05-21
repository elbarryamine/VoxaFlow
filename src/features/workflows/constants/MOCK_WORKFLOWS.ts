import type { Workflow } from "../types/Workflow.types";

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1",
    user_id: "mock-user",
    name: "Lead Qualification Pipeline",
    is_active: true,
    definition: { nodes: [], edges: [] },
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
    runsCount: 842,
    lastRun: "2 hours ago",
  },
  {
    id: "wf-2",
    user_id: "mock-user",
    name: "Support Escalation Flow",
    is_active: true,
    definition: { nodes: [], edges: [] },
    created_at: "2026-03-05T10:00:00Z",
    updated_at: "2026-03-05T10:00:00Z",
    runsCount: 1563,
    lastRun: "15 min ago",
  },
  {
    id: "wf-3",
    user_id: "mock-user",
    name: "Appointment Reminder",
    is_active: false,
    definition: { nodes: [], edges: [] },
    created_at: "2026-03-10T10:00:00Z",
    updated_at: "2026-03-10T10:00:00Z",
    runsCount: 234,
    lastRun: "3 days ago",
  },
];

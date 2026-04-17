import type { Workflow } from "../types/Workflow.types";

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1",
    name: "Lead Qualification Pipeline",
    description: "Qualify leads, run AI call, then update CRM and notify sales",
    status: "active",
    agentId: "agent-1",
    agentName: "Sales Qualifier",
    runsCount: 842,
    lastRun: "2 hours ago",
    createdAt: "2026-03-20",
  },
  {
    id: "wf-2",
    name: "Support Escalation Flow",
    description: "Triage support calls and escalate unresolved issues to Slack",
    status: "active",
    agentId: "agent-2",
    agentName: "Support Triage",
    runsCount: 1_563,
    lastRun: "15 min ago",
    createdAt: "2026-03-05",
  },
  {
    id: "wf-3",
    name: "Appointment Reminder",
    description: "Call patients 24h before appointment, update spreadsheet",
    status: "inactive",
    agentId: "agent-3",
    agentName: "Appointment Setter",
    runsCount: 234,
    lastRun: "3 days ago",
    createdAt: "2026-03-10",
  },
];

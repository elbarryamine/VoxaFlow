import type { Workflow } from "../types/Workflow.types";

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1",
    name: "Lead Qualification Pipeline",
    description: "Qualify leads via AI, then update CRM and notify sales",
    status: "active",
    profileId: "p-1",
    profileName: "Sales Lead Qualifier",
    runsCount: 842,
    lastRun: "2 hours ago",
    createdAt: "2026-03-20",
  },
  {
    id: "wf-2",
    name: "Support Escalation Flow",
    description: "Triage support requests and escalate unresolved issues to Slack",
    status: "active",
    profileId: "p-2",
    profileName: "Support Ticket Triage",
    runsCount: 1563,
    lastRun: "15 min ago",
    createdAt: "2026-03-05",
  },
  {
    id: "wf-3",
    name: "Appointment Reminder",
    description: "Remind patients 24h before appointment via AI, update spreadsheet",
    status: "inactive",
    profileId: "p-3",
    profileName: "Appointment Reminder",
    runsCount: 234,
    lastRun: "3 days ago",
    createdAt: "2026-03-10",
  },
];

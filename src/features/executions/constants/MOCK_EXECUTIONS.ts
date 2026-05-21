import type { Execution } from "../types/Execution.types";

export const MOCK_EXECUTIONS: Execution[] = [
  {
    id: "exec-1",
    workflowName: "Sales Lead Qualifier",
    workflowId: "wf-1",
    status: "success",
    duration: "12s",
    trigger: "Shopify Trigger",
    startedAt: "2026-05-10T14:30:00Z",
    failedNodeId: null,
    nodePath: [
      {
        nodeId: "n1",
        nodeType: "webhook-shopify",
        label: "Shopify Trigger",
        status: "success",
      },
      {
        nodeId: "n2",
        nodeType: "ai-custom-model",
        label: "AI Custom Model",
        status: "success",
      },
      {
        nodeId: "n3",
        nodeType: "integration-slack",
        label: "Slack",
        status: "success",
      },
    ],
  },
  {
    id: "exec-2",
    workflowName: "Support Ticket Triage",
    workflowId: "wf-2",
    status: "success",
    duration: "4s",
    trigger: "Custom Webhook",
    startedAt: "2026-05-10T14:25:00Z",
    failedNodeId: null,
    nodePath: [
      {
        nodeId: "n1",
        nodeType: "webhook-custom",
        label: "Custom Webhook",
        status: "success",
      },
      {
        nodeId: "n2",
        nodeType: "openai",
        label: "OpenAI",
        status: "success",
      },
    ],
  },
  {
    id: "exec-3",
    workflowName: "Appointment Reminder",
    workflowId: "wf-3",
    status: "failed",
    duration: "1m 05s",
    trigger: "Shopify Trigger",
    startedAt: "2026-05-10T14:20:00Z",
    failedNodeId: "n2",
    nodePath: [
      {
        nodeId: "n1",
        nodeType: "webhook-shopify",
        label: "Shopify Trigger",
        status: "success",
      },
      {
        nodeId: "n2",
        nodeType: "send-email",
        label: "Send Email",
        status: "failed",
      },
      {
        nodeId: "n3",
        nodeType: "delay",
        label: "Delay",
        status: "skipped",
      },
    ],
  },
  {
    id: "exec-4",
    workflowName: "Survey Collector",
    workflowId: "wf-4",
    status: "running",
    duration: "…",
    trigger: "Custom Webhook",
    startedAt: "2026-05-10T14:40:00Z",
    failedNodeId: null,
    nodePath: [
      {
        nodeId: "n1",
        nodeType: "webhook-custom",
        label: "Custom Webhook",
        status: "success",
      },
      {
        nodeId: "n2",
        nodeType: "openai",
        label: "OpenAI",
        status: "running",
      },
      {
        nodeId: "n3",
        nodeType: "integration-slack",
        label: "Slack",
        status: "pending",
      },
    ],
  },
];

import type { WorkflowNodeType } from "../types/Workflow.types";

export interface NodeTemplate {
  type: WorkflowNodeType;
  label: string;
  description: string;
  category: "trigger" | "intelligent-action" | "normal-action";
}

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: "webhook-shopify",
    label: "Shopify Trigger",
    description: "Trigger from Shopify events",
    category: "trigger",
  },
  {
    type: "webhook-lightfunnels",
    label: "Lightfunnels Trigger",
    description: "Trigger from Lightfunnels events",
    category: "trigger",
  },
  {
    type: "webhook-youcan",
    label: "YouCan Trigger",
    description: "Trigger from YouCan events",
    category: "trigger",
  },
  {
    type: "webhook-custom",
    label: "Custom Webhook Trigger",
    description: "POST to a generated URL to trigger flow",
    category: "trigger",
  },
  {
    type: "ai-custom-model",
    label: "AI Custom Model",
    description: "Run a custom AI reasoning/model step",
    category: "intelligent-action",
  },
  {
    type: "integration-slack",
    label: "Slack",
    description: "Send a Slack notification",
    category: "normal-action",
  },
  {
    type: "integration-spreadsheet",
    label: "Spreadsheet",
    description: "Write rows to a spreadsheet",
    category: "normal-action",
  },
  {
    type: "integration-email",
    label: "Email",
    description: "Send an email update",
    category: "normal-action",
  },
  {
    type: "integration-webhook",
    label: "Webhook",
    description: "Call any external API endpoint",
    category: "normal-action",
  },
  {
    type: "api-request",
    label: "API Request",
    description: "Make an HTTP request and define output schema",
    category: "normal-action",
  },
];

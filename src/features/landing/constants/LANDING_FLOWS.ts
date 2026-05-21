import type { Edge, Node } from "@xyflow/react";

import type { WorkflowNodeData } from "@/src/features/workflows/types/Workflow.types";

export interface LandingFlowLogLine {
  time: string;
  message: string;
}

export interface LandingFlowPreset {
  id: string;
  figLabel: string;
  mobileCaption: string;
  logLines: LandingFlowLogLine[];
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  cursorPath: string[];
}

const EDGE_STYLE = { strokeDasharray: "6 4" } as const;

const landingNode = (
  id: string,
  position: { x: number; y: number },
  data: WorkflowNodeData,
): Node<WorkflowNodeData> => ({
  id,
  type: "landingFlowNode",
  position,
  data: { configured: true, ...data },
  draggable: false,
  selectable: false,
  connectable: false,
});

const landingEdge = (
  source: string,
  target: string,
  sourceHandle?: string,
  label?: string,
): Edge => ({
  id: `e-${source}-${target}${sourceHandle ? `-${sourceHandle}` : ""}`,
  source,
  target,
  sourceHandle,
  animated: true,
  style: EDGE_STYLE,
  label,
});

export const LANDING_FLOWS: LandingFlowPreset[] = [
  {
    id: "ecommerce",
    figLabel: "Fig. A — Order fulfillment",
    mobileCaption: "Shopify Trigger → AI Custom Model → Slack",
    logLines: [
      { time: "00:01", message: "webhook.received order.created" },
      { time: "00:02", message: "ai.complete → route #orders" },
      { time: "00:04", message: "slack.posted → run.complete" },
    ],
    cursorPath: ["shopify", "ai", "slack"],
    nodes: [
      landingNode("shopify", { x: 24, y: 72 }, {
        type: "webhook-shopify",
        label: "Shopify Trigger",
        description: "Trigger from Shopify events",
        agentName: "order.created",
      }),
      landingNode("ai", { x: 268, y: 72 }, {
        type: "ai-custom-model",
        label: "AI Custom Model",
        description: "Run a custom AI reasoning step",
        modelName: "gpt-4o",
        outputFormat: "text",
      }),
      landingNode("slack", { x: 512, y: 72 }, {
        type: "integration-slack",
        label: "Slack",
        description: "Send a Slack notification",
        slackChannel: "#orders",
      }),
    ],
    edges: [
      landingEdge("shopify", "ai"),
      landingEdge("ai", "slack"),
    ],
  },
  {
    id: "leads",
    figLabel: "Fig. B — Lead routing",
    mobileCaption: "Custom Webhook → OpenAI → Send Email",
    logLines: [
      { time: "00:01", message: "webhook.received /hooks/leads" },
      { time: "00:03", message: "openai.structured → lead score" },
      { time: "00:05", message: "email.sent → run.complete" },
    ],
    cursorPath: ["webhook", "openai", "email"],
    nodes: [
      landingNode("webhook", { x: 24, y: 88 }, {
        type: "webhook-custom",
        label: "Custom Webhook",
        description: "HTTP trigger for any payload",
        webhookPath: "/hooks/leads",
      }),
      landingNode("openai", { x: 268, y: 88 }, {
        type: "openai",
        label: "OpenAI",
        description: "Generate text or structured data",
        model: "gpt-4o",
      }),
      landingNode("email", { x: 512, y: 88 }, {
        type: "send-email",
        label: "Send Email",
        description: "Send an email via Resend",
        to: "sales@team.com",
        subject: "New lead",
      }),
    ],
    edges: [
      landingEdge("webhook", "openai"),
      landingEdge("openai", "email"),
    ],
  },
  {
    id: "triage",
    figLabel: "Fig. C — Support triage",
    mobileCaption: "Shopify → AI branch → Slack / Delay",
    logLines: [
      { time: "00:01", message: "webhook.received refund.request" },
      { time: "00:02", message: "branch.matched → yes path" },
      { time: "00:04", message: "slack.alerted → run.complete" },
    ],
    cursorPath: ["shopify-triage", "ai-branch", "slack-yes", "delay-no"],
    nodes: [
      landingNode("shopify-triage", { x: 24, y: 100 }, {
        type: "webhook-shopify",
        label: "Shopify Trigger",
        description: "Trigger from Shopify events",
        agentName: "refund.created",
      }),
      landingNode("ai-branch", { x: 268, y: 100 }, {
        type: "ai-custom-model",
        label: "AI Custom Model",
        description: "Route by refund urgency",
        outputFormat: "branch",
        aiConditionPrompt: "Is this refund urgent?",
      }),
      landingNode("slack-yes", { x: 512, y: 36 }, {
        type: "slack",
        label: "Slack",
        description: "Post a message to a channel",
        channel: "#support-urgent",
      }),
      landingNode("delay-no", { x: 512, y: 196 }, {
        type: "delay",
        label: "Delay",
        description: "Pause before follow-up",
        delayAmount: "2",
        delayUnit: "hours",
      }),
    ],
    edges: [
      landingEdge("shopify-triage", "ai-branch"),
      landingEdge("ai-branch", "slack-yes", "yes", "Yes"),
      landingEdge("ai-branch", "delay-no", "no", "No"),
    ],
  },
];

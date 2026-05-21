import type { Edge, Node } from "@xyflow/react";

import type { WorkflowNodeData } from "@/src/features/workflows/types/Workflow.types";

export interface LandingFlowLogLine {
  time: string;
  message: string;
}

export interface LandingFlowPreset {
  id: string;
  figLabel: string;
  pickerLabel: string;
  mobileCaption: string;
  logLines: LandingFlowLogLine[];
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
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
    pickerLabel: "Order fulfillment",
    mobileCaption: "Shopify Trigger → AI Custom Model → Slack",
    logLines: [
      { time: "00:01", message: "New order received" },
      { time: "00:02", message: "AI routed to #orders" },
      { time: "00:04", message: "Slack sent · finished" },
    ],
    nodes: [
      landingNode("shopify", { x: 40, y: 80 }, {
        type: "webhook-shopify",
        label: "Shopify Trigger",
        description: "Trigger from Shopify events",
        agentName: "order.created",
      }),
      landingNode("ai", { x: 340, y: 80 }, {
        type: "ai-custom-model",
        label: "AI Custom Model",
        description: "Run a custom AI reasoning step",
        modelName: "gpt-4o",
        outputFormat: "text",
      }),
      landingNode("slack", { x: 640, y: 80 }, {
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
    pickerLabel: "Lead routing",
    mobileCaption: "Custom Webhook → OpenAI → Send Email",
    logLines: [
      { time: "00:01", message: "New lead received" },
      { time: "00:03", message: "AI scored the lead" },
      { time: "00:05", message: "Email sent · finished" },
    ],
    nodes: [
      landingNode("webhook", { x: 40, y: 96 }, {
        type: "webhook-custom",
        label: "Custom Webhook",
        description: "HTTP trigger for any payload",
        webhookPath: "/hooks/leads",
      }),
      landingNode("openai", { x: 340, y: 96 }, {
        type: "openai",
        label: "OpenAI",
        description: "Generate text or structured data",
        model: "gpt-4o",
      }),
      landingNode("email", { x: 640, y: 96 }, {
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
    pickerLabel: "Support triage",
    mobileCaption: "Shopify → AI branch → Slack / Delay",
    logLines: [
      { time: "00:01", message: "Refund request received" },
      { time: "00:02", message: "Routed to urgent path" },
      { time: "00:04", message: "Slack alerted · finished" },
    ],
    nodes: [
      landingNode("shopify-triage", { x: 40, y: 120 }, {
        type: "webhook-shopify",
        label: "Shopify Trigger",
        description: "Trigger from Shopify events",
        agentName: "refund.created",
      }),
      landingNode("ai-branch", { x: 340, y: 120 }, {
        type: "ai-custom-model",
        label: "AI Custom Model",
        description: "Route by refund urgency",
        outputFormat: "branch",
        aiConditionPrompt: "Is this refund urgent?",
      }),
      landingNode("slack-yes", { x: 640, y: 32 }, {
        type: "slack",
        label: "Slack",
        description: "Post a message to a channel",
        channel: "#support-urgent",
      }),
      landingNode("delay-no", { x: 640, y: 248 }, {
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
  {
    id: "inventory",
    figLabel: "Fig. D — Low stock alert",
    pickerLabel: "Low stock alert",
    mobileCaption: "Shopify Trigger → OpenAI → Slack",
    logLines: [
      { time: "00:01", message: "Stock level updated" },
      { time: "00:02", message: "Low stock flagged" },
      { time: "00:03", message: "Slack sent to #inventory" },
    ],
    nodes: [
      landingNode("shopify-stock", { x: 40, y: 88 }, {
        type: "webhook-shopify",
        label: "Shopify Trigger",
        description: "Trigger from Shopify events",
        agentName: "inventory.updated",
      }),
      landingNode("openai-stock", { x: 340, y: 88 }, {
        type: "openai",
        label: "OpenAI",
        description: "Summarize stock risk",
        model: "gpt-4o-mini",
      }),
      landingNode("slack-stock", { x: 640, y: 88 }, {
        type: "slack",
        label: "Slack",
        description: "Post a message to a channel",
        channel: "#inventory",
      }),
    ],
    edges: [
      landingEdge("shopify-stock", "openai-stock"),
      landingEdge("openai-stock", "slack-stock"),
    ],
  },
  {
    id: "abandoned-cart",
    figLabel: "Fig. E — Abandoned cart",
    pickerLabel: "Abandoned cart",
    mobileCaption: "Custom Webhook → Delay → Send Email",
    logLines: [
      { time: "00:01", message: "Cart abandoned" },
      { time: "00:02", message: "Waited 2 hours" },
      { time: "00:05", message: "Recovery email sent" },
    ],
    nodes: [
      landingNode("cart-webhook", { x: 40, y: 96 }, {
        type: "webhook-custom",
        label: "Custom Webhook",
        description: "HTTP trigger for any payload",
        webhookPath: "/hooks/cart",
      }),
      landingNode("cart-delay", { x: 340, y: 96 }, {
        type: "delay",
        label: "Delay",
        description: "Pause before follow-up",
        delayAmount: "2",
        delayUnit: "hours",
      }),
      landingNode("cart-email", { x: 640, y: 96 }, {
        type: "send-email",
        label: "Send Email",
        description: "Send an email via Resend",
        to: "shopper@email.com",
        subject: "Still interested?",
      }),
    ],
    edges: [
      landingEdge("cart-webhook", "cart-delay"),
      landingEdge("cart-delay", "cart-email"),
    ],
  },
  {
    id: "sheet-sync",
    figLabel: "Fig. F — Sheet sync",
    pickerLabel: "Sheet sync",
    mobileCaption: "Shopify Trigger → API Request → Spreadsheet",
    logLines: [
      { time: "00:01", message: "Order paid" },
      { time: "00:02", message: "Customer details added" },
      { time: "00:04", message: "Row added to sheet" },
    ],
    nodes: [
      landingNode("shopify-sheet", { x: 40, y: 80 }, {
        type: "webhook-shopify",
        label: "Shopify Trigger",
        description: "Trigger from Shopify events",
        agentName: "order.paid",
      }),
      landingNode("api-enrich", { x: 340, y: 80 }, {
        type: "api-request",
        label: "API Request",
        description: "Make an HTTP request",
        method: "GET",
        url: "https://api.crm/enrich",
      }),
      landingNode("sheet-out", { x: 640, y: 80 }, {
        type: "integration-spreadsheet",
        label: "Spreadsheet",
        description: "Write rows to a spreadsheet",
        spreadsheetId: "orders-log",
        spreadsheetTab: "Daily",
      }),
    ],
    edges: [
      landingEdge("shopify-sheet", "api-enrich"),
      landingEdge("api-enrich", "sheet-out"),
    ],
  },
  {
    id: "post-purchase",
    figLabel: "Fig. G — Post-purchase",
    pickerLabel: "Post-purchase",
    mobileCaption: "Lightfunnels → AI Custom Model → Email",
    logLines: [
      { time: "00:01", message: "Purchase completed" },
      { time: "00:03", message: "AI wrote follow-up" },
      { time: "00:05", message: "Email delivered" },
    ],
    nodes: [
      landingNode("lf-trigger", { x: 40, y: 92 }, {
        type: "webhook-lightfunnels",
        label: "Lightfunnels Trigger",
        description: "Trigger from Lightfunnels events",
        agentName: "purchase.done",
      }),
      landingNode("ai-upsell", { x: 340, y: 92 }, {
        type: "ai-custom-model",
        label: "AI Custom Model",
        description: "Personalize follow-up copy",
        modelName: "gpt-4o",
        outputFormat: "text",
      }),
      landingNode("email-upsell", { x: 640, y: 92 }, {
        type: "integration-email",
        label: "Email",
        description: "Send an email update",
        emailTo: "buyer@email.com",
        emailSubject: "Thanks + what's next",
      }),
    ],
    edges: [
      landingEdge("lf-trigger", "ai-upsell"),
      landingEdge("ai-upsell", "email-upsell"),
    ],
  },
];

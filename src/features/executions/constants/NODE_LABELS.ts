export const EXECUTION_NODE_LABELS: Record<string, string> = {
  "webhook-shopify": "Shopify Trigger",
  "webhook-lightfunnels": "Lightfunnels Trigger",
  "webhook-youcan": "YouCan Trigger",
  "webhook-custom": "Custom Webhook",
  "send-email": "Send Email",
  slack: "Slack",
  openai: "OpenAI",
  "api-request": "API Request",
  condition: "Condition",
  delay: "Delay",
  "ai-custom-model": "AI Custom Model",
  "integration-slack": "Slack",
  "integration-email": "Email",
  "integration-spreadsheet": "Spreadsheet",
  "integration-webhook": "Webhook",
};

export const getExecutionNodeLabel = (nodeType: string): string =>
  EXECUTION_NODE_LABELS[nodeType] ?? nodeType;

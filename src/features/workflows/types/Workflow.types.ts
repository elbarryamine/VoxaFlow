export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  agentId: string;
  agentName: string;
  runsCount: number;
  lastRun: string;
  createdAt: string;
}

export type WorkflowNodeType =
  | "inbound-call"
  | "outbound-call"
  | "webhook-shopify"
  | "webhook-lightfunnels"
  | "webhook-youcan"
  | "webhook-custom"
  | "ai-custom-model"
  | "condition"
  | "integration-slack"
  | "integration-spreadsheet"
  | "integration-email"
  | "integration-webhook";

export type WorkflowNodeData = {
  label: string;
  type: WorkflowNodeType;
  description?: string;
  icon?: string;
  configured?: boolean;
  // Shared trigger assignment (call target agent)
  agentId?: string;
  agentName?: string;
  // Trigger specifics
  phoneNumber?: string;
  callerId?: string;
  webhookPath?: string;
  // Intelligent actions
  modelName?: string;
  modelPrompt?: string;
  conditionType?: "field" | "ai";
  conditionField?: string;
  conditionOperator?: string;
  conditionValue?: string;
  aiConditionPrompt?: string;
  // Integrations
  slackChannel?: string;
  spreadsheetId?: string;
  spreadsheetTab?: string;
  emailTo?: string;
  emailSubject?: string;
  method?: string;
  url?: string;
  [key: string]: unknown;
};

export type WorkflowNodeDataValue = string | number | boolean | undefined;

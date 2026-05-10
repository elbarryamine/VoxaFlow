export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  profileId: string;
  profileName: string;
  runsCount: number;
  lastRun: string;
  createdAt: string;
}

export type WorkflowNodeType =
  | "webhook-shopify"
  | "webhook-lightfunnels"
  | "webhook-youcan"
  | "webhook-custom"
  | "ai-custom-model"
  | "integration-slack"
  | "integration-spreadsheet"
  | "integration-email"
  | "integration-webhook"
  | "api-request";

export type WorkflowNodeData = {
  label: string;
  type: WorkflowNodeType;
  description?: string;
  icon?: string;
  configured?: boolean;
  // Shared trigger assignment
  profileId?: string;
  profileName?: string;
  // Trigger specifics
  webhookPath?: string;
  // Intelligent actions
  modelName?: string;
  customModelName?: string;
  modelPrompt?: string;
  outputFormat?: "text" | "json" | "branch";
  jsonSchemaFields?: { name: string; type: string; description: string }[];
  aiConditionPrompt?: string;
  // Integrations
  slackChannel?: string;
  spreadsheetId?: string;
  spreadsheetTab?: string;
  emailTo?: string;
  emailSubject?: string;
  method?: string;
  url?: string;
  headersTemplate?: string;
  expectedOutputFields?: { name: string; type: string; description: string }[];
  [key: string]: unknown;
};

export type WorkflowNodeDataValue = string | number | boolean | unknown[] | Record<string, unknown> | undefined;

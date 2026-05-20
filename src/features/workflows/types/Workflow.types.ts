export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  definition: {
    nodes: any[];
    edges: any[];
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // UI helper fields (calculated or joined)
  runsCount?: number;
  lastRun?: string;
  profileName?: string;
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
  | "api-request"
  // New executor-backed nodes
  | "openai"
  | "slack"
  | "send-email"
  | "delay";

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

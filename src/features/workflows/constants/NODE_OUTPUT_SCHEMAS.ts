import { WorkflowNodeType } from "../types/Workflow.types";

export interface OutputField {
  name: string;
  type: string;
  description: string;
}

export type OutputSchemaDefinition = OutputField[] | ((data: Record<string, unknown>) => OutputField[]);

export const NODE_OUTPUT_SCHEMAS: Record<WorkflowNodeType, OutputSchemaDefinition> = {
  "webhook-shopify": [
    { name: "body", type: "object", description: "The raw payload from Shopify" },
    { name: "headers", type: "object", description: "The webhook headers" },
    { name: "topic", type: "string", description: "The Shopify topic (e.g., orders/create)" },
  ],
  "webhook-lightfunnels": [
    { name: "body", type: "object", description: "The raw payload from Lightfunnels" },
    { name: "headers", type: "object", description: "The webhook headers" },
  ],
  "webhook-youcan": [
    { name: "body", type: "object", description: "The raw payload from YouCan" },
    { name: "headers", type: "object", description: "The webhook headers" },
  ],
  "webhook-custom": [
    { name: "body", type: "object", description: "The raw JSON body of the request" },
    { name: "headers", type: "object", description: "The HTTP headers" },
    { name: "query", type: "object", description: "The URL query parameters" },
  ],
  "ai-custom-model": (data) => {
    const baseFields: OutputField[] = data.outputFormat === "branch" 
      ? [
          { name: "__branch", type: "string", description: "The routing result ('yes' or 'no')" }
        ]
      : [
          { 
            name: "modelOutput", 
            type: data.outputFormat === "json" ? "object" : "string", 
            description: data.outputFormat === "json" ? "The structured JSON response from the model" : "The raw text response from the model" 
          },
        ];

    if (data.outputFormat === "json" && Array.isArray(data.jsonSchemaFields)) {
      const jsonFields = data.jsonSchemaFields as { name?: string; type?: string; description?: string }[];
      const customFields = jsonFields
        .filter((field) => field && typeof field.name === "string" && field.name.trim() !== "")
        .map((field) => ({
          name: (field.name || "").trim(),
          type: typeof field.type === "string" ? field.type : "unknown",
          description: typeof field.description === "string" && field.description.trim() ? field.description : "Custom JSON field",
        }));
      
      if (customFields.length > 0) {
        return [...baseFields, ...customFields];
      }
    }

    return baseFields;
  },
  "integration-slack": [
    { name: "slackResponse", type: "object", description: "Response from Slack API" }
  ],
  "integration-spreadsheet": [
    { name: "spreadsheetResponse", type: "object", description: "Response from the Spreadsheet API" }
  ],
  "integration-email": [
    { name: "emailResponse", type: "object", description: "Response from the Email provider" }
  ],
  "integration-webhook": [
    { name: "webhookResponse", type: "object", description: "The response body from the external API" },
    { name: "webhookStatus", type: "number", description: "The HTTP status code" }
  ],
  "api-request": (data) => {
    const baseFields: OutputField[] = [
      { name: "responseBody", type: "object", description: "The raw response body" },
      { name: "status", type: "number", description: "The HTTP status code" },
    ];
    
    if (Array.isArray(data.expectedOutputFields)) {
      const outputFields = data.expectedOutputFields as { name?: string; type?: string; description?: string }[];
      const customFields = outputFields
        .filter((field) => field && typeof field.name === "string" && field.name.trim() !== "")
        .map((field) => ({
          name: (field.name || "").trim(),
          type: typeof field.type === "string" ? field.type : "unknown",
          description: typeof field.description === "string" && field.description.trim() ? field.description : "Custom response field",
        }));
      
      if (customFields.length > 0) {
        return [...baseFields, ...customFields];
      }
    }
    
    return baseFields;
  },

  // Executor-backed nodes
  "openai": [
    { name: "text", type: "string", description: "The raw text response from the model" },
    { name: "model", type: "string", description: "The model used (e.g. gpt-4o-mini)" },
    { name: "finish_reason", type: "string", description: "Why the model stopped (stop, length, etc.)" },
    { name: "usage", type: "object", description: "Token usage: { prompt_tokens, completion_tokens, total_tokens }" },
  ],
  "slack": [
    { name: "ts", type: "string", description: "Slack message timestamp (unique message ID)" },
    { name: "channel", type: "string", description: "The channel the message was posted to" },
    { name: "message_text", type: "string", description: "The text that was sent" },
  ],
  "send-email": [
    { name: "email_id", type: "string", description: "The Resend email ID" },
    { name: "to", type: "array", description: "The list of recipients" },
    { name: "subject", type: "string", description: "The subject that was sent" },
  ],
  "delay": [
    { name: "delayed_seconds", type: "number", description: "How many seconds the workflow was paused" },
  ],
};

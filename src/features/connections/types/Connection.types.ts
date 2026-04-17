export type ConnectionType =
  | "openai"
  | "anthropic"
  | "slack"
  | "google-sheets"
  | "email"
  | "webhook";

export type ConnectionStatus = "connected" | "error";

export interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  status: ConnectionStatus;
  createdAt: string;
  credentials: Record<string, string>;
}

export const CONNECTION_TYPE_LABELS: Record<ConnectionType, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  slack: "Slack",
  "google-sheets": "Google Sheets",
  email: "Email / SMTP",
  webhook: "Webhook",
};

export const CONNECTION_CREDENTIAL_FIELDS: Record<
  ConnectionType,
  { key: string; label: string; placeholder?: string; secret?: boolean; optional?: boolean }[]
> = {
  openai: [
    { key: "apiKey", label: "API Key", placeholder: "sk-...", secret: true },
    { key: "orgId", label: "Organization ID", placeholder: "org-...", optional: true },
  ],
  anthropic: [
    { key: "apiKey", label: "API Key", placeholder: "sk-ant-...", secret: true },
  ],
  slack: [
    { key: "botToken", label: "Bot Token", placeholder: "xoxb-...", secret: true },
    { key: "defaultChannel", label: "Default Channel", placeholder: "#general", optional: true },
  ],
  "google-sheets": [
    { key: "serviceAccountJson", label: "Service Account JSON", placeholder: '{"type":"service_account",...}', secret: true },
  ],
  email: [
    { key: "host", label: "SMTP Host", placeholder: "smtp.example.com" },
    { key: "port", label: "Port", placeholder: "587" },
    { key: "username", label: "Username", placeholder: "user@example.com" },
    { key: "password", label: "Password", secret: true },
  ],
  webhook: [
    { key: "baseUrl", label: "Base URL", placeholder: "https://api.example.com" },
    { key: "authHeader", label: "Auth Header", placeholder: "Bearer token...", optional: true, secret: true },
  ],
};

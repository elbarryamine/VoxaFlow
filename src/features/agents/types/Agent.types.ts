export interface Agent {
  id: string;
  name: string;
  description: string;
  voice: string;
  language: string;
  status: "active" | "inactive" | "draft";
  callsHandled: number;
  avgDuration: string;
  successRate: number;
  createdAt: string;
}

export type AgentVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export type AgentLanguage = "en" | "fr" | "es" | "de" | "ar";

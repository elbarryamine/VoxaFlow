import type { SupabaseClient } from "@supabase/supabase-js";

export interface AgentListItem {
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

interface AgentRow {
  id: string;
  name: string;
  description: string;
  voice: string;
  language: string;
  status: "active" | "inactive" | "draft";
  created_at: string;
}

export async function listAgents(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("agents")
    .select("id, name, description, voice, language, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<AgentRow[]>();

  if (error) {
    throw new Error(`Unable to fetch agents: ${error.message}`);
  }

  return (data ?? []).map<AgentListItem>((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    voice: row.voice,
    language: row.language,
    status: row.status,
    callsHandled: 0,
    avgDuration: "0m",
    successRate: 0,
    createdAt: row.created_at,
  }));
}

export interface CreateAgentInput {
  name: string;
  description: string;
  instructions: string;
  voice: string;
  language: string;
  status?: "active" | "inactive" | "draft";
}

export async function createAgent(
  supabase: SupabaseClient,
  userId: string,
  input: CreateAgentInput,
) {
  if (!input.name.trim()) {
    throw new Error("Agent name is required");
  }

  if (!input.instructions.trim()) {
    throw new Error("Agent instructions are required");
  }

  const { data, error } = await supabase
    .from("agents")
    .insert({
      user_id: userId,
      name: input.name.trim(),
      description: input.description.trim(),
      instructions: input.instructions.trim(),
      voice: input.voice,
      language: input.language,
      status: input.status ?? "active",
    })
    .select("id, name, description, voice, language, status, created_at")
    .single<AgentRow>();

  if (error) {
    throw new Error(`Unable to create agent: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    voice: data.voice,
    language: data.language,
    status: data.status,
    callsHandled: 0,
    avgDuration: "0m",
    successRate: 0,
    createdAt: data.created_at,
  } satisfies AgentListItem;
}

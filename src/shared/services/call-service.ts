import type { SupabaseClient } from "@supabase/supabase-js";
import { startVapiCall } from "@/src/shared/integrations/vapi";
import { getOrAssignPhoneNumber } from "@/src/shared/services/phone-number-service";
import { getFreeTierDailyLimit } from "@/src/shared/server/env";

interface AgentRow {
  id: string;
  user_id: string;
  name: string;
  instructions: string;
  voice: string;
  language: string;
}

const E164_REGEX = /^\+[1-9]\d{6,14}$/;

function assertValidPhoneNumber(number: string, fieldName: string) {
  if (!E164_REGEX.test(number)) {
    throw new Error(`${fieldName} must be a valid E.164 number`);
  }
}

async function ensureFreeTierWithinLimit(supabase: SupabaseClient, userId: string) {
  const periodStart = new Date().toISOString().slice(0, 10);
  const dailyLimit = getFreeTierDailyLimit();

  const { data: existing, error: readError } = await supabase
    .from("rate_limit_counters")
    .select("id, calls_count")
    .eq("user_id", userId)
    .eq("period_start", periodStart)
    .maybeSingle<{ id: string; calls_count: number }>();

  if (readError) {
    throw new Error(`Unable to read free-tier usage: ${readError.message}`);
  }

  if (!existing) {
    const { error: createError } = await supabase.from("rate_limit_counters").insert({
      user_id: userId,
      period_start: periodStart,
      calls_count: 1,
    });

    if (createError) {
      throw new Error(`Unable to track free-tier usage: ${createError.message}`);
    }
    return;
  }

  if (existing.calls_count >= dailyLimit) {
    throw new Error(`Daily free-tier call limit reached (${dailyLimit})`);
  }

  const { error: updateError } = await supabase
    .from("rate_limit_counters")
    .update({
      calls_count: existing.calls_count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (updateError) {
    throw new Error(`Unable to update free-tier usage: ${updateError.message}`);
  }
}

async function ensureNoBurstDuplicateCalls(
  supabase: SupabaseClient,
  userId: string,
  toNumber: string,
) {
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { data, error } = await supabase
    .from("calls")
    .select("id")
    .eq("user_id", userId)
    .eq("to_number", toNumber)
    .gte("created_at", oneMinuteAgo)
    .limit(1);

  if (error) {
    throw new Error(`Unable to validate burst protection: ${error.message}`);
  }

  if ((data ?? []).length > 0) {
    throw new Error("Please wait before calling this number again");
  }
}

async function fetchAgentById(supabase: SupabaseClient, userId: string, agentId: string) {
  const { data, error } = await supabase
    .from("agents")
    .select("id, user_id, name, instructions, voice, language")
    .eq("id", agentId)
    .eq("user_id", userId)
    .single<AgentRow>();

  if (error) {
    throw new Error(`Unable to fetch agent: ${error.message}`);
  }

  return data;
}

export interface StartCallInput {
  userId: string;
  agentId: string;
  toNumber: string;
  workflowId?: string;
}

export async function startCall(
  supabase: SupabaseClient,
  input: StartCallInput,
) {
  assertValidPhoneNumber(input.toNumber, "toNumber");

  const agent = await fetchAgentById(supabase, input.userId, input.agentId);
  const resolvedNumber = await getOrAssignPhoneNumber(supabase, input.userId);

  if (resolvedNumber.plan === "free") {
    await ensureFreeTierWithinLimit(supabase, input.userId);
    await ensureNoBurstDuplicateCalls(supabase, input.userId, input.toNumber);
  }
  try {
    const vapiCall = await startVapiCall({
      to: input.toNumber,
      from: resolvedNumber.phoneNumber.number,
      agent: {
        name: agent.name,
        instructions: agent.instructions,
        voice: agent.voice,
        language: agent.language,
      },
    });

    const { data: callRow, error } = await supabase
      .from("calls")
      .insert({
        user_id: input.userId,
        agent_id: agent.id,
        workflow_id: input.workflowId ?? null,
        to_number: input.toNumber,
        from_number: resolvedNumber.phoneNumber.number,
        vapi_call_id: vapiCall.id,
        status: vapiCall.status === "ended" ? "completed" : "in_progress",
      })
      .select(
        "id, user_id, agent_id, workflow_id, to_number, from_number, vapi_call_id, status, created_at",
      )
      .single();

    if (error) {
      throw new Error(`Unable to persist call log: ${error.message}`);
    }

    return {
      id: callRow.id as string,
      toNumber: callRow.to_number as string,
      fromNumber: callRow.from_number as string,
      status: callRow.status as string,
      vapiCallId: callRow.vapi_call_id as string | null,
      createdAt: callRow.created_at as string,
    };
  } catch (error) {
    await supabase.from("calls").insert({
      user_id: input.userId,
      agent_id: agent.id,
      workflow_id: input.workflowId ?? null,
      to_number: input.toNumber,
      from_number: resolvedNumber.phoneNumber.number,
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown call error",
    });
    throw error;
  }
}

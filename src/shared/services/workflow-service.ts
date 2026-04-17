import type { SupabaseClient } from "@supabase/supabase-js";
import { startCall } from "@/src/shared/services/call-service";

interface WorkflowRow {
  id: string;
  user_id: string;
  agent_id: string;
  trigger_type: string;
  is_active: boolean;
}

interface WorkflowExecutionPayload {
  toNumber?: string;
  [key: string]: unknown;
}

export async function runWorkflow(
  supabase: SupabaseClient,
  userId: string,
  triggerType: string,
  payload: WorkflowExecutionPayload,
) {
  const { data: workflows, error } = await supabase
    .from("workflows")
    .select("id, user_id, agent_id, trigger_type, is_active")
    .eq("user_id", userId)
    .eq("trigger_type", triggerType)
    .eq("is_active", true)
    .returns<WorkflowRow[]>();

  if (error) {
    throw new Error(`Unable to fetch workflows: ${error.message}`);
  }

  const workflowRuns = [] as Array<{
    workflowId: string;
    status: "completed" | "failed";
    callId?: string;
    error?: string;
  }>;

  for (const workflow of workflows ?? []) {
    let runStatus: "completed" | "failed" = "completed";
    let runErrorMessage: string | null = null;

    try {
      if (!payload.toNumber || typeof payload.toNumber !== "string") {
        throw new Error("Workflow payload must include toNumber");
      }

      const call = await startCall(supabase, {
        userId,
        agentId: workflow.agent_id,
        toNumber: payload.toNumber,
        workflowId: workflow.id,
      });

      workflowRuns.push({
        workflowId: workflow.id,
        status: "completed",
        callId: call.id,
      });
    } catch (error) {
      runStatus = "failed";
      runErrorMessage = error instanceof Error ? error.message : "Unknown workflow error";
      workflowRuns.push({
        workflowId: workflow.id,
        status: "failed",
        error: runErrorMessage,
      });
    }

    const { error: runInsertError } = await supabase.from("workflow_runs").insert({
      workflow_id: workflow.id,
      user_id: userId,
      trigger_type: triggerType,
      payload,
      status: runStatus,
      error_message: runErrorMessage,
    });

    if (runInsertError) {
      throw new Error(`Unable to persist workflow run: ${runInsertError.message}`);
    }
  }

  return workflowRuns;
}

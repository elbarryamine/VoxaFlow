import type { User } from "@supabase/supabase-js";

import {
  buildPlanUsage,
  getMonthStartIso,
} from "@/src/features/dashboard/utils/buildPlanUsage";
import { getUserPlanId } from "@/src/features/dashboard/utils/getUserPlanId";
import type { PlanUsage } from "@/src/features/dashboard/types/Dashboard.types";
import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";
import {
  mapDbExecution,
  type DbExecutionRow,
} from "@/src/features/executions/utils/mapDbExecution";
import type { Execution } from "@/src/features/executions/types/Execution.types";
import type { Workflow } from "@/src/features/workflows/types/Workflow.types";
import type { DashboardMetrics } from "../types/Dashboard.types";
import { formatRelativeTime } from "./formatRelativeTime";
import { buildDashboardMetrics } from "./buildDashboardMetrics";

interface DbWorkflowRow {
  id: string;
  user_id: string;
  name: string;
  definition: Workflow["definition"];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  executions?: { count: number }[];
}

function mapDbWorkflow(
  row: DbWorkflowRow,
  runsCount: number,
  lastRun: string,
): Workflow {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    definition: row.definition ?? { nodes: [], edges: [] },
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    runsCount,
    lastRun,
  };
}

export interface DashboardData {
  executions: Execution[];
  workflows: Workflow[];
  metrics: DashboardMetrics;
  usage: PlanUsage;
}

export async function loadDashboardData(user: User): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();
  const userId = user.id;
  const planId = getUserPlanId(user);
  const monthStart = getMonthStartIso();

  const [executionsResult, workflowsResult, monthlyRunsResult] =
    await Promise.all([
      supabase
        .from("executions")
        .select("*, workflows(name), node_executions(node_id, node_type, status, created_at)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("workflows")
        .select("*, executions(count)")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      supabase
        .from("executions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", monthStart),
    ]);

  const dbExecutions = (executionsResult.data ?? []) as DbExecutionRow[];
  const executions = dbExecutions.map(mapDbExecution);

  const lastRunByWorkflow = new Map<string, string>();
  for (const row of dbExecutions) {
    if (!lastRunByWorkflow.has(row.workflow_id)) {
      lastRunByWorkflow.set(
        row.workflow_id,
        formatRelativeTime(row.created_at),
      );
    }
  }

  const dbWorkflows = (workflowsResult.data ?? []) as DbWorkflowRow[];
  const workflows = dbWorkflows.map((row) =>
    mapDbWorkflow(
      row,
      row.executions?.[0]?.count ?? 0,
      lastRunByWorkflow.get(row.id) ?? "Never",
    ),
  );

  const metrics = buildDashboardMetrics(executions, workflows);
  const monthlyRuns = monthlyRunsResult.count ?? 0;
  const usage = buildPlanUsage(planId, monthlyRuns, metrics.activeWorkflows);

  return {
    executions,
    workflows,
    metrics,
    usage,
  };
}

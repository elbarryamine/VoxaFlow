import { createSupabaseServerClient } from "@/src/shared/utils/supabase-server";
import {
  mapDbExecution,
  type DbExecutionRow,
} from "@/src/features/executions/utils/mapDbExecution";
import type { Execution } from "@/src/features/executions/types/Execution.types";
import type { Workflow } from "@/src/features/workflows/types/Workflow.types";
import type { ActivityItem, DashboardMetrics } from "../types/Dashboard.types";
import { formatRelativeTime } from "./formatRelativeTime";
import { buildDashboardMetrics } from "./buildDashboardMetrics";

interface DbWorkflowRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  definition: Workflow["definition"];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  executions?: { count: number }[];
}

const EXECUTION_ACTION: Record<Execution["status"], string> = {
  success: "Run completed successfully",
  failed: "Run failed",
  running: "Run in progress",
  waiting: "Run waiting to start",
};

function mapExecutionToActivity(execution: Execution): ActivityItem {
  const outcome: ActivityItem["outcome"] =
    execution.status === "success"
      ? "success"
      : execution.status === "failed"
        ? "failed"
        : "pending";

  return {
    id: execution.id,
    workflow: execution.workflowName,
    action: EXECUTION_ACTION[execution.status],
    outcome,
    time: formatRelativeTime(execution.startedAt),
  };
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
    description: row.description,
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
  activities: ActivityItem[];
  metrics: DashboardMetrics;
}

export async function loadDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();

  const [executionsResult, workflowsResult] = await Promise.all([
    supabase
      .from("executions")
      .select("*, workflows(name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("workflows")
      .select("*, executions(count)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
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

  const activities = executions.slice(0, 8).map(mapExecutionToActivity);
  const metrics = buildDashboardMetrics(executions, workflows);

  return {
    executions,
    workflows,
    activities,
    metrics,
  };
}

import type { Execution } from "@/src/features/executions/types/Execution.types";
import type { Workflow } from "@/src/features/workflows/types/Workflow.types";
import type { DashboardMetrics, DayBucket } from "../types/Dashboard.types";

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

function buildLast7Days(executions: Execution[]): DayBucket[] {
  const days: DayBucket[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      label: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      count: 0,
      success: 0,
      failed: 0,
    });
  }

  const byKey = new Map(days.map((day) => [day.date, day]));

  for (const execution of executions) {
    const key = toDateKey(execution.startedAt);
    const bucket = byKey.get(key);
    if (!bucket) continue;
    bucket.count += 1;
    if (execution.status === "success") bucket.success += 1;
    if (execution.status === "failed") bucket.failed += 1;
  }

  return days;
}

export function buildDashboardMetrics(
  executions: Execution[],
  workflows: Workflow[],
): DashboardMetrics {
  const todayKey = new Date().toISOString().slice(0, 10);
  const statusBreakdown = {
    success: 0,
    failed: 0,
    running: 0,
    waiting: 0,
  };

  for (const execution of executions) {
    statusBreakdown[execution.status] += 1;
  }

  const total = executions.length;
  const successRatePercent =
    total === 0 ? 0 : Math.round((statusBreakdown.success / total) * 100);

  const activeWorkflows = workflows.filter((w) => w.is_active).length;

  return {
    totalExecutions: total,
    activeWorkflows,
    totalWorkflows: workflows.length,
    inactiveWorkflows: workflows.length - activeWorkflows,
    successCount: statusBreakdown.success,
    failedCount: statusBreakdown.failed,
    runningCount: statusBreakdown.running,
    waitingCount: statusBreakdown.waiting,
    successRatePercent,
    runsToday: executions.filter((e) => toDateKey(e.startedAt) === todayKey).length,
    last7Days: buildLast7Days(executions),
    statusBreakdown,
  };
}

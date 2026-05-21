import type { DashboardMetrics } from "@/src/features/dashboard/types/Dashboard.types";
import { KpiCard } from "@/src/features/dashboard/ui/KpiCard";
import { MiniBarChart } from "@/src/features/dashboard/ui/charts/MiniBarChart";
import { StatusBreakdownChart } from "@/src/features/dashboard/ui/charts/StatusBreakdownChart";
import { SuccessRateGaugeChart } from "@/src/features/dashboard/ui/charts/SuccessRateGaugeChart";
import { WorkflowMixDonutChart } from "@/src/features/dashboard/ui/charts/WorkflowMixDonutChart";

interface DashboardKpiSectionProps {
  metrics: DashboardMetrics;
}

export const DashboardKpiSection = ({ metrics }: DashboardKpiSectionProps) => {
  const successHintTone =
    metrics.totalExecutions === 0 || metrics.successRatePercent >= 50
      ? "neutral"
      : "negative";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total runs"
        value={String(metrics.totalExecutions)}
        hint={
          metrics.runsToday > 0
            ? `${metrics.runsToday} today`
            : metrics.totalExecutions > 0
              ? "No runs today"
              : "No runs yet"
        }
        slotClassName="flex flex-col justify-end"
      >
        <MiniBarChart days={metrics.last7Days} />
      </KpiCard>

      <KpiCard
        label="Success rate"
        value={`${metrics.successRatePercent}%`}
        hint={
          metrics.totalExecutions > 0
            ? `${metrics.successCount} succeeded · ${metrics.failedCount} failed`
            : "Run a workflow to measure"
        }
        hintTone={successHintTone}
      >
        <SuccessRateGaugeChart percent={metrics.successRatePercent} />
      </KpiCard>

      <KpiCard
        label="Active workflows"
        value={String(metrics.activeWorkflows)}
        hint={`${metrics.totalWorkflows} total · ${metrics.inactiveWorkflows} inactive`}
      >
        <WorkflowMixDonutChart
          active={metrics.activeWorkflows}
          inactive={metrics.inactiveWorkflows}
        />
      </KpiCard>

      <KpiCard
        label="Failed runs"
        value={String(metrics.failedCount)}
        hint={
          metrics.runningCount > 0
            ? `${metrics.runningCount} still running`
            : metrics.failedCount > 0
              ? "Review failed executions"
              : metrics.totalExecutions > 0
                ? "No failures in recent runs"
                : "No data yet"
        }
        hintTone={metrics.failedCount > 0 ? "negative" : "neutral"}
      >
        <StatusBreakdownChart breakdown={metrics.statusBreakdown} />
      </KpiCard>
    </div>
  );
};

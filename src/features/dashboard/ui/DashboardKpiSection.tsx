import {
  Pulse,
  GitBranch,
  TrendUp,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { DashboardMetrics } from "@/src/features/dashboard/types/Dashboard.types";
import { KpiCard } from "@/src/features/dashboard/ui/KpiCard";
import { MiniBarChart } from "@/src/features/dashboard/ui/charts/MiniBarChart";
import { SuccessDonut } from "@/src/features/dashboard/ui/charts/SuccessDonut";
import { StatusStackBar } from "@/src/features/dashboard/ui/charts/StatusStackBar";
import { ExecutionTrendChart } from "@/src/features/dashboard/ui/charts/ExecutionTrendChart";

interface DashboardKpiSectionProps {
  metrics: DashboardMetrics;
}

const kpiIconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container/50 text-on-secondary-container";

export const DashboardKpiSection = ({ metrics }: DashboardKpiSectionProps) => {
  const successHintTone =
    metrics.totalExecutions === 0
      ? "neutral"
      : metrics.successRatePercent >= 80
        ? "positive"
        : metrics.successRatePercent < 50
          ? "negative"
          : "neutral";

  const barData = metrics.last7Days.map((d) => ({
    label: d.label,
    value: d.count,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          icon={
            <span className={kpiIconClass}>
              <Pulse className="h-5 w-5" weight="duotone" />
            </span>
          }
        >
          <MiniBarChart data={barData} />
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
          icon={
            <span className={kpiIconClass}>
              <TrendUp className="h-5 w-5" weight="duotone" />
            </span>
          }
        >
          <div className="flex justify-center pt-1">
            <SuccessDonut percent={metrics.successRatePercent} size={72} />
          </div>
        </KpiCard>

        <KpiCard
          label="Active workflows"
          value={String(metrics.activeWorkflows)}
          hint={`${metrics.totalWorkflows} total · ${metrics.inactiveWorkflows} inactive`}
          icon={
            <span className={kpiIconClass}>
              <GitBranch className="h-5 w-5" weight="duotone" />
            </span>
          }
        >
          <div className="space-y-2">
            <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-variant/30">
              {metrics.totalWorkflows > 0 ? (
                <>
                  <div
                    className="bg-success"
                    style={{
                      width: `${(metrics.activeWorkflows / metrics.totalWorkflows) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-outline/50"
                    style={{
                      width: `${(metrics.inactiveWorkflows / metrics.totalWorkflows) * 100}%`,
                    }}
                  />
                </>
              ) : (
                <div className="w-full bg-surface-variant/40" />
              )}
            </div>
            <div className="flex justify-between font-manrope text-[11px] font-bold text-on-surface-variant">
              <span className="text-success">Active</span>
              <span>Inactive</span>
            </div>
          </div>
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
          hintTone={
            metrics.failedCount > 0
              ? "negative"
              : metrics.runningCount > 0
                ? "neutral"
                : "positive"
          }
          icon={
            <span className={kpiIconClass}>
              {metrics.failedCount > 0 ? (
                <XCircle className="h-5 w-5" weight="duotone" />
              ) : (
                <CheckCircle className="h-5 w-5" weight="duotone" />
              )}
            </span>
          }
        >
          <StatusStackBar breakdown={metrics.statusBreakdown} />
          <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 font-manrope text-[11px] font-bold text-on-surface-variant">
            <li>
              <span className="text-success">{metrics.successCount}</span> success
            </li>
            <li>
              <span className="text-error">{metrics.failedCount}</span> failed
            </li>
            <li>
              <span className="text-primary">{metrics.runningCount}</span> running
            </li>
            <li>
              <span>{metrics.waitingCount}</span> waiting
            </li>
          </ul>
        </KpiCard>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-newsreader text-xl font-bold text-on-surface">
              Execution volume
            </h3>
            <p className="mt-0.5 font-manrope text-[13px] font-medium text-on-surface-variant">
              Daily runs over the last week
            </p>
          </div>
        </div>
        <ExecutionTrendChart days={metrics.last7Days} />
      </div>
    </div>
  );
};

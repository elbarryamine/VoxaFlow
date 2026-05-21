import Link from "next/link";

import type { PlanUsage } from "@/src/features/dashboard/types/Dashboard.types";
import { settingsPlanHref } from "@/src/features/settings/constants/SETTINGS_SECTIONS";
import { KpiCard } from "@/src/features/dashboard/ui/KpiCard";
import { UsageProgressChart } from "@/src/features/dashboard/ui/charts/UsageProgressChart";
interface DashboardUsageSectionProps {
  usage: PlanUsage;
}

function usageHintTone(used: number, limit: number): "negative" | "neutral" {
  if (limit <= 0) return "neutral";
  const percent = (used / limit) * 100;
  if (percent >= 100) return "negative";
  return "neutral";
}

export const DashboardUsageSection = ({ usage }: DashboardUsageSectionProps) => {
  const runsRemaining = Math.max(0, usage.monthlyRunsLimit - usage.monthlyRuns);
  const runsTone = usageHintTone(usage.monthlyRuns, usage.monthlyRunsLimit);
  const hasWorkflowCap = usage.activeWorkflowsLimit !== null;

  const workflowTone =
    hasWorkflowCap && usage.activeWorkflowsLimit !== null
      ? usageHintTone(usage.activeWorkflows, usage.activeWorkflowsLimit)
      : "neutral";

  const workflowValue = hasWorkflowCap
    ? `${usage.activeWorkflows} / ${usage.activeWorkflowsLimit}`
    : String(usage.activeWorkflows);

  const workflowHint = hasWorkflowCap
    ? `${Math.max(0, (usage.activeWorkflowsLimit ?? 0) - usage.activeWorkflows)} slots left · ${usage.planName}`
    : `Unlimited active workflows · ${usage.planName}`;

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-newsreader text-lg font-bold text-on-surface">
            Plan usage
          </h2>
          <p className="font-manrope text-[12px] font-medium text-on-surface-variant">
            <span className="font-bold text-on-surface">{usage.planName}</span>
            {" · "}
            {usage.planPrice} {usage.planPeriod}
            {" · "}
            {usage.maxSeats === 1 ? "1 seat" : `${usage.maxSeats} seats`}
          </p>
        </div>
        <Link
          href={settingsPlanHref()}
          className="font-manrope text-[13px] font-bold text-primary transition-colors hover:text-primary/80"
        >
          View plans
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <KpiCard
          label="Runs this month"
          value={`${usage.monthlyRuns.toLocaleString()} / ${usage.monthlyRunsLimit.toLocaleString()}`}
          hint={
            runsRemaining === 0 && usage.monthlyRuns >= usage.monthlyRunsLimit
              ? "Monthly limit reached"
              : `${runsRemaining.toLocaleString()} runs left · resets monthly`
          }
          hintTone={runsTone}
        >
          <UsageProgressChart
            used={usage.monthlyRuns}
            limit={usage.monthlyRunsLimit}
            usedLabel="Used"
            remainingLabel="Left"
          />
        </KpiCard>

        <KpiCard
          label="Active workflows"
          value={workflowValue}
          hint={workflowHint}
          hintTone={workflowTone}
        >
          {hasWorkflowCap && usage.activeWorkflowsLimit !== null ? (
            <UsageProgressChart
              used={usage.activeWorkflows}
              limit={usage.activeWorkflowsLimit}
              usedLabel="Active"
              remainingLabel="Available"
            />
          ) : (
            <p className="font-manrope text-[11px] font-semibold text-on-surface-variant">
              No limit on active workflows
            </p>
          )}
        </KpiCard>
      </div>
    </section>
  );
};

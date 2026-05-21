import type { PlanUsage } from "@/src/features/dashboard/types/Dashboard.types";
import { getPlan, type PlanId } from "@/src/shared/constants/plans";

export function buildPlanUsage(
  planId: PlanId,
  monthlyRuns: number,
  activeWorkflows: number,
): PlanUsage {
  const plan = getPlan(planId);

  return {
    planId: plan.id,
    planName: plan.name,
    planPrice: plan.price,
    planPeriod: plan.period,
    monthlyRuns,
    monthlyRunsLimit: plan.maxRunsPerMonth,
    activeWorkflows,
    activeWorkflowsLimit: plan.maxActiveWorkflows,
    maxSeats: plan.maxSeats,
  };
}

export function getMonthStartIso(): string {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  return start.toISOString();
}

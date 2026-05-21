export interface DayBucket {
  date: string;
  label: string;
  count: number;
  success: number;
  failed: number;
}

export interface StatusBreakdown {
  success: number;
  failed: number;
  running: number;
  waiting: number;
}

import type { PlanId } from "@/src/shared/constants/plans";

export interface PlanUsage {
  planId: PlanId;
  planName: string;
  planPrice: string;
  planPeriod: string;
  monthlyRuns: number;
  monthlyRunsLimit: number;
  activeWorkflows: number;
  activeWorkflowsLimit: number | null;
  maxSeats: number;
}

export interface DashboardMetrics {
  totalExecutions: number;
  activeWorkflows: number;
  totalWorkflows: number;
  inactiveWorkflows: number;
  successCount: number;
  failedCount: number;
  runningCount: number;
  waitingCount: number;
  successRatePercent: number;
  runsToday: number;
  last7Days: DayBucket[];
  statusBreakdown: StatusBreakdown;
}

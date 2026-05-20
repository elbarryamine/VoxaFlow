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

"use client";

import { cn } from "@/src/shared/utils/cn";

import { UsageProgressChart } from "./UsageProgressChart";

interface WorkflowMixDonutChartProps {
  active: number;
  inactive: number;
  className?: string;
}

export const WorkflowMixDonutChart = ({
  active,
  inactive,
  className,
}: WorkflowMixDonutChartProps) => {
  const total = active + inactive;

  return (
    <UsageProgressChart
      className={cn(className)}
      used={active}
      limit={total}
      usedLabel="Active"
      remainingLabel="Inactive"
    />
  );
};

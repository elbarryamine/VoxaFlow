"use client";

import { cn } from "@/src/shared/utils/cn";

import { UsageProgressChart } from "./UsageProgressChart";
import { KPI_LEGEND_TONES, kpiSemanticFill } from "./kpi-chart-theme";

interface SuccessRateGaugeChartProps {
  percent: number;
  className?: string;
}

export const SuccessRateGaugeChart = ({
  percent,
  className,
}: SuccessRateGaugeChartProps) => {
  const clamped = Math.min(100, Math.max(0, percent));
  const fill = kpiSemanticFill(clamped);
  const legendTone =
    clamped < 50 ? KPI_LEGEND_TONES.error : KPI_LEGEND_TONES.primary;

  return (
    <UsageProgressChart
      className={cn(className)}
      used={clamped}
      limit={100}
      usedLabel="Succeeded"
      remainingLabel="Other"
      usedFill={fill}
      usedLegendClassName={legendTone}
    />
  );
};

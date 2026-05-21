"use client";

import type { StatusBreakdown } from "@/src/features/dashboard/types/Dashboard.types";
import { cn } from "@/src/shared/utils/cn";

import {
  MiniStackedBarChart,
  type ChartSegment,
} from "./MiniStackedBarChart";
import { KPI_LEGEND_TONES, KPI_STATUS_SLICES } from "./kpi-chart-theme";

interface StatusBreakdownChartProps {
  breakdown: StatusBreakdown;
  className?: string;
}

export const StatusBreakdownChart = ({
  breakdown,
  className,
}: StatusBreakdownChartProps) => {
  const segments: ChartSegment[] = KPI_STATUS_SLICES.flatMap((slice) => {
    const value = breakdown[slice.key];
    if (value <= 0) return [];

    return [
      {
        key: slice.key,
        value,
        fill: slice.fill,
        label: slice.name,
        legendClassName: KPI_LEGEND_TONES[slice.tone],
      },
    ];
  });

  return <MiniStackedBarChart className={cn(className)} segments={segments} />;
};

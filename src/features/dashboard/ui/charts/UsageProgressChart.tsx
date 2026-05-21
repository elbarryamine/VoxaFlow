"use client";

import { cn } from "@/src/shared/utils/cn";

import {
  MiniStackedBarChart,
  type ChartSegment,
} from "@/src/features/dashboard/ui/charts/MiniStackedBarChart";

import { KPI_COLORS, KPI_LEGEND_TONES } from "./kpi-chart-theme";

interface UsageProgressChartProps {
  used: number;
  limit: number;
  usedLabel?: string;
  remainingLabel?: string;
  usedFill?: string;
  usedLegendClassName?: string;
  className?: string;
}

export const UsageProgressChart = ({
  used,
  limit,
  usedLabel = "Used",
  remainingLabel = "Remaining",
  usedFill = KPI_COLORS.primary,
  usedLegendClassName = KPI_LEGEND_TONES.primary,
  className,
}: UsageProgressChartProps) => {
  const isOver = used > limit;
  const clampedUsed = Math.min(used, limit);
  const remaining = Math.max(0, limit - used);

  const segments: ChartSegment[] = isOver
    ? [
        {
          key: "used",
          value: limit,
          fill: KPI_COLORS.error,
          label: usedLabel,
          legendClassName: KPI_LEGEND_TONES.error,
        },
      ]
    : [
        {
          key: "used",
          value: clampedUsed,
          fill: usedFill,
          label: usedLabel,
          legendClassName: usedLegendClassName,
        },
        ...(remaining > 0
          ? [
              {
                key: "remaining",
                value: remaining,
                fill: KPI_COLORS.muted,
                label: remainingLabel,
              },
            ]
          : []),
      ];

  return <MiniStackedBarChart className={cn(className)} segments={segments} />;
};

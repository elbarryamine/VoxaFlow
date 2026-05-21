import { cn } from "@/src/shared/utils/cn";

import { KPI_DONUT_MAX_WIDTH, KPI_MINI_CHART_HEIGHT } from "./kpi-chart-theme";

interface KpiChartEmptyRingProps {
  className?: string;
}

export const KpiChartEmptyRing = ({ className }: KpiChartEmptyRingProps) => (
  <div
    className={cn(
      "rounded-full border-2 border-border/50 bg-surface-variant/25",
      className,
    )}
    style={{ height: KPI_MINI_CHART_HEIGHT, width: KPI_DONUT_MAX_WIDTH }}
    aria-hidden
  />
);

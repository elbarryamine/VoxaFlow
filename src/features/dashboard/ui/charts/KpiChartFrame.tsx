import { cn } from "@/src/shared/utils/cn";

import { KPI_MINI_CHART_HEIGHT } from "./kpi-chart-theme";

interface KpiChartFrameProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const KpiChartFrame = ({
  children,
  className,
  fullWidth = true,
}: KpiChartFrameProps) => (
  <div
    className={cn(fullWidth ? "w-full" : "mx-auto w-full", className)}
    style={{ height: KPI_MINI_CHART_HEIGHT }}
  >
    {children}
  </div>
);

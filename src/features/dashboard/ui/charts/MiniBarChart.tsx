"use client";

import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DayBucket } from "@/src/features/dashboard/types/Dashboard.types";
import { cn } from "@/src/shared/utils/cn";

import { KpiChartFrame } from "./KpiChartFrame";
import {
  KPI_AREA_CHART_MARGIN,
  KPI_AREA_GRADIENT,
  KPI_COLORS,
  KPI_STROKE_WIDTH,
  kpiAxisTickStyle,
  kpiTooltipCursor,
  kpiTooltipLabelStyle,
  kpiTooltipStyle,
} from "./kpi-chart-theme";

interface MiniBarChartProps {
  days: DayBucket[];
  className?: string;
}

interface ChartRow {
  label: string;
  total: number;
}

export const MiniBarChart = ({ days, className }: MiniBarChartProps) => {
  const uid = useId().replace(/:/g, "");
  const areaGradId = `${uid}-runs`;

  const data: ChartRow[] = days.map((day) => ({
    label: day.label,
    total: day.count,
  }));

  const yMax = useMemo(
    () => Math.max(1, ...data.map((row) => row.total)),
    [data],
  );

  return (
    <KpiChartFrame className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={KPI_AREA_CHART_MARGIN}>
          <defs>
            <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={KPI_COLORS.primary}
                stopOpacity={KPI_AREA_GRADIENT.topOpacity}
              />
              <stop
                offset="100%"
                stopColor={KPI_COLORS.primary}
                stopOpacity={KPI_AREA_GRADIENT.bottomOpacity}
              />
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, yMax]} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={kpiAxisTickStyle}
            interval={0}
            tickMargin={2}
          />
          <Tooltip
            cursor={kpiTooltipCursor}
            contentStyle={kpiTooltipStyle}
            labelStyle={kpiTooltipLabelStyle}
            formatter={(value) => [value ?? 0, "Runs"]}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="total"
            baseValue={0}
            stroke={KPI_COLORS.primary}
            strokeWidth={KPI_STROKE_WIDTH}
            fill={`url(#${areaGradId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </KpiChartFrame>
  );
};

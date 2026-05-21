"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/src/shared/utils/cn";

import { KpiChartFrame } from "./KpiChartFrame";
import {
  KPI_DONUT_MAX_WIDTH,
  KPI_PIE,
  kpiTooltipLabelStyle,
  kpiTooltipStyle,
} from "./kpi-chart-theme";

export interface KpiDonutSlice {
  key: string;
  name: string;
  value: number;
  fill: string;
}

interface KpiDonutChartProps {
  slices: KpiDonutSlice[];
  className?: string;
}

export const KpiDonutChart = ({ slices, className }: KpiDonutChartProps) => (
  <div className={cn("mx-auto w-full", className)} style={{ maxWidth: KPI_DONUT_MAX_WIDTH }}>
    <KpiChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={KPI_PIE.innerRadius}
            outerRadius={KPI_PIE.outerRadius}
            paddingAngle={KPI_PIE.paddingAngle}
            strokeWidth={KPI_PIE.strokeWidth}
          >
            {slices.map((slice) => (
              <Cell key={slice.key} fill={slice.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={kpiTooltipStyle}
            labelStyle={kpiTooltipLabelStyle}
            formatter={(value, name) => [value ?? 0, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </KpiChartFrame>
  </div>
);

"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/src/shared/utils/cn";

import {
  KPI_COLORS,
  KPI_LEGEND_LABEL_CLASS,
  kpiTooltipLabelStyle,
  kpiTooltipStyle,
} from "./kpi-chart-theme";

export interface ChartSegment {
  key: string;
  value: number;
  fill: string;
  label: string;
  legendClassName?: string;
}

interface MiniStackedBarChartProps {
  segments: ChartSegment[];
  className?: string;
  showLegend?: boolean;
}

const STACK_ROW_KEY = "stack";
const BAR_RADIUS = 4;

/** Recharts: [topLeft, topRight, bottomRight, bottomLeft] for horizontal stacked bars. */
function stackedBarRadius(index: number, count: number): [number, number, number, number] {
  if (count === 1) return [BAR_RADIUS, BAR_RADIUS, BAR_RADIUS, BAR_RADIUS];
  if (index === 0) return [BAR_RADIUS, 0, 0, BAR_RADIUS];
  if (index === count - 1) return [0, BAR_RADIUS, BAR_RADIUS, 0];
  return [0, 0, 0, 0];
}

export const MiniStackedBarChart = ({
  segments,
  className,
  showLegend = true,
}: MiniStackedBarChartProps) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const row = segments.reduce<Record<string, number | string>>(
    (acc, segment) => {
      acc[segment.key] = segment.value;
      return acc;
    },
    { name: STACK_ROW_KEY },
  );

  if (total === 0) {
    return (
      <div className={cn(showLegend && "space-y-1.5", className)}>
        <div
          className="h-2.5 w-full rounded-full bg-surface-variant/40"
          aria-hidden
        />
        {showLegend && <SegmentLegend segments={segments} />}
      </div>
    );
  }

  return (
    <div className={cn(showLegend && "space-y-1.5", className)}>
      <div className="h-2.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={[row]}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, total]} hide />
            <YAxis type="category" dataKey="name" hide width={0} />
            <Tooltip
              cursor={false}
              contentStyle={kpiTooltipStyle}
              labelStyle={kpiTooltipLabelStyle}
              formatter={(value, name) => {
                const segment = segments.find((s) => s.key === name);
                return [value ?? 0, segment?.label ?? String(name)];
              }}
              labelFormatter={() => ""}
            />
            {segments.map((segment, index) => (
              <Bar
                key={segment.key}
                dataKey={segment.key}
                stackId="stack"
                fill={segment.fill}
                radius={stackedBarRadius(index, segments.length)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {showLegend && <SegmentLegend segments={segments} />}
    </div>
  );
};

const SegmentLegend = ({ segments }: { segments: ChartSegment[] }) => (
  <div className="flex justify-between">
    {segments.map((segment) => (
      <span
        key={segment.key}
        className={cn(KPI_LEGEND_LABEL_CLASS, segment.legendClassName)}
      >
        {segment.label}
      </span>
    ))}
  </div>
);

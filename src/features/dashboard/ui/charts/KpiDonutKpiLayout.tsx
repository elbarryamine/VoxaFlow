"use client";

import { cn } from "@/src/shared/utils/cn";

import { KpiChartEmptyRing } from "./KpiChartEmptyRing";
import { KpiChartLegendGrid, type KpiLegendItem } from "./KpiChartLegend";
import { KpiDonutChart, type KpiDonutSlice } from "./KpiDonutChart";
import { KPI_DONUT_LAYOUT_GAP } from "./kpi-chart-theme";

interface KpiDonutKpiLayoutProps {
  slices: KpiDonutSlice[];
  legendItems: KpiLegendItem[];
  legendColumns?: 2 | 4;
  className?: string;
}

export const KpiDonutKpiLayout = ({
  slices,
  legendItems,
  legendColumns = 2,
  className,
}: KpiDonutKpiLayoutProps) => {
  const chartSlices = slices.filter((slice) => slice.value > 0);
  const hasData = chartSlices.length > 0;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        KPI_DONUT_LAYOUT_GAP,
        className,
      )}
    >
      {hasData ? <KpiDonutChart slices={chartSlices} /> : <KpiChartEmptyRing />}
      <KpiChartLegendGrid items={legendItems} columns={legendColumns} />
    </div>
  );
};

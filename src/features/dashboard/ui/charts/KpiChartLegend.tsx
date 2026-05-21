import { cn } from "@/src/shared/utils/cn";

import {
  KPI_LEGEND_DOTS,
  KPI_LEGEND_LABEL_CLASS,
  KPI_LEGEND_TONES,
  KPI_LEGEND_VALUE_CLASS,
  type KpiLegendTone,
} from "./kpi-chart-theme";

export interface KpiLegendItem {
  key: string;
  label: string;
  value: number | string;
  tone?: KpiLegendTone;
}

interface LegendSlot {
  item: KpiLegendItem;
  column: number;
}

interface KpiChartLegendGridProps {
  items: KpiLegendItem[];
  columns?: 2 | 4;
  className?: string;
}

function buildLegendSlots(
  items: KpiLegendItem[],
  columns: 2 | 4,
): LegendSlot[] {
  if (columns === 4 && items.length === 2) {
    return [
      { item: items[0], column: 1 },
      { item: items[1], column: 4 },
    ];
  }

  return items.map((item, index) => ({ item, column: index + 1 }));
}

const LegendCell = ({
  item,
  centered,
}: {
  item: KpiLegendItem;
  centered: boolean;
}) => (
  <div
    className={cn(
      "flex min-w-0 items-start gap-1.5",
      centered && "flex-col items-center gap-1 text-center",
    )}
  >
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        centered ? "" : "mt-1",
        item.tone ? KPI_LEGEND_DOTS[item.tone] : "bg-outline-variant",
      )}
      aria-hidden
    />
    <div className="min-w-0">
      <p className={cn(KPI_LEGEND_LABEL_CLASS, "truncate")}>{item.label}</p>
      <p
        className={cn(
          KPI_LEGEND_VALUE_CLASS,
          centered && "mt-0 text-[11px]",
          item.tone ? KPI_LEGEND_TONES[item.tone] : "text-on-surface",
        )}
      >
        {item.value}
      </p>
    </div>
  </div>
);

/** Donut / gauge legends (MetricCell-style label + value). */
export const KpiChartLegendGrid = ({
  items,
  columns = 2,
  className,
}: KpiChartLegendGridProps) => {
  const slots = buildLegendSlots(items, columns);
  const useFourColumns = columns === 4;

  return (
    <ul
      className={cn(
        "grid w-full gap-x-2 gap-y-2",
        useFourColumns ? "grid-cols-4" : "grid-cols-2 gap-x-3",
        className,
      )}
    >
      {useFourColumns
        ? Array.from({ length: 4 }, (_, index) => {
            const column = index + 1;
            const slot = slots.find((s) => s.column === column);

            return (
              <li key={slot?.item.key ?? `spacer-${column}`} className="min-w-0">
                {slot ? (
                  <LegendCell item={slot.item} centered />
                ) : (
                  <span className="sr-only">Empty</span>
                )}
              </li>
            );
          })
        : slots.map(({ item }) => (
            <li key={item.key} className="min-w-0">
              <LegendCell item={item} centered={false} />
            </li>
          ))}
    </ul>
  );
};

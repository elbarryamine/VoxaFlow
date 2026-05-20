import { cn } from "@/src/shared/utils/cn";

export interface MiniBarChartItem {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: MiniBarChartItem[];
  barClassName?: string;
  highlightLast?: boolean;
  className?: string;
}

export const MiniBarChart = ({
  data,
  barClassName = "bg-primary/70",
  highlightLast = true,
  className,
}: MiniBarChartProps) => {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className={cn("flex h-16 items-end justify-between gap-1.5", className)}>
      {data.map((item, index) => {
        const heightPct = item.value === 0 ? 4 : Math.max(12, (item.value / max) * 100);
        const isLast = index === data.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex min-w-0 flex-1 flex-col items-center gap-1"
          >
            <div
              className={cn(
                "w-full min-h-[3px] rounded-t-sm transition-all duration-300",
                barClassName,
                highlightLast && isLast && "bg-primary",
                item.value === 0 && "bg-surface-variant/60",
              )}
              style={{ height: `${heightPct}%` }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="truncate font-manrope text-[9px] font-bold uppercase tracking-wide text-on-surface-variant/80">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

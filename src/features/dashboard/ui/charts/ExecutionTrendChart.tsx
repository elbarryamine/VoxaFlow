import type { DayBucket } from "@/src/features/dashboard/types/Dashboard.types";
import { cn } from "@/src/shared/utils/cn";

interface ExecutionTrendChartProps {
  days: DayBucket[];
}

export const ExecutionTrendChart = ({ days }: ExecutionTrendChartProps) => {
  const max = Math.max(1, ...days.map((d) => d.count));
  const chartHeight = 120;

  return (
    <div className="font-manrope">
      <div
        className="flex items-end justify-between gap-2 sm:gap-3"
        style={{ height: chartHeight }}
      >
        {days.map((day) => {
          const totalH =
            day.count === 0 ? 0 : Math.max(8, (day.count / max) * chartHeight);
          const successH =
            day.count === 0 ? 0 : (day.success / day.count) * totalH;
          const failedH = totalH - successH;

          return (
            <div
              key={day.date}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className="flex w-full max-w-[40px] flex-col justify-end overflow-hidden rounded-t-md mx-auto"
                style={{ height: totalH || 4 }}
                title={`${day.label}: ${day.count} runs (${day.success} ok, ${day.failed} failed)`}
              >
                {failedH > 0 && (
                  <div
                    className="w-full bg-error/85"
                    style={{ height: failedH }}
                  />
                )}
                {successH > 0 && (
                  <div
                    className="w-full bg-success/85"
                    style={{ height: successH }}
                  />
                )}
                {day.count === 0 && (
                  <div className="h-1 w-full rounded-t-md bg-surface-variant/50" />
                )}
              </div>
              <span className="truncate text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border/40 pt-4">
        <LegendDot className="bg-success" label="Success" />
        <LegendDot className="bg-error" label="Failed" />
        <span className="text-[12px] font-medium text-on-surface-variant">
          Last 7 days · {days.reduce((n, d) => n + d.count, 0)} runs
        </span>
      </div>
    </div>
  );
};

const LegendDot = ({
  className,
  label,
}: {
  className: string;
  label: string;
}) => (
  <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-on-surface-variant">
    <span className={cn("h-2 w-2 rounded-full", className)} />
    {label}
  </span>
);

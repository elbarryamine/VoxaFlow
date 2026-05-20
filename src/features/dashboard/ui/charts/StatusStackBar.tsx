import type { StatusBreakdown } from "@/src/features/dashboard/types/Dashboard.types";

interface StatusStackBarProps {
  breakdown: StatusBreakdown;
}

const SEGMENTS = [
  { key: "success" as const, className: "bg-success" },
  { key: "failed" as const, className: "bg-error" },
  { key: "running" as const, className: "bg-primary" },
  { key: "waiting" as const, className: "bg-outline/60" },
] as const;

export const StatusStackBar = ({ breakdown }: StatusStackBarProps) => {
  const total =
    breakdown.success +
    breakdown.failed +
    breakdown.running +
    breakdown.waiting;

  if (total === 0) {
    return (
      <div className="h-2.5 w-full rounded-full bg-surface-variant/40" aria-hidden />
    );
  }

  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-variant/30">
      {SEGMENTS.map(({ key, className }) => {
        const value = breakdown[key];
        if (value === 0) return null;
        return (
          <div
            key={key}
            className={className}
            style={{ width: `${(value / total) * 100}%` }}
            title={`${key}: ${value}`}
          />
        );
      })}
    </div>
  );
};

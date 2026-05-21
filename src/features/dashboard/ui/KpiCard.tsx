import { cn } from "@/src/shared/utils/cn";

type HintTone = "positive" | "negative" | "neutral";

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  hintTone?: HintTone;
  children?: React.ReactNode;
  slotClassName?: string;
  className?: string;
}

const hintToneClass: Record<HintTone, string> = {
  positive: "text-success",
  negative: "text-error",
  neutral: "text-on-surface-variant",
};

export const KpiCard = ({
  label,
  value,
  hint,
  hintTone = "neutral",
  children,
  slotClassName,
  className,
}: KpiCardProps) => (
  <div
    className={cn(
      "flex flex-col rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:border-outline-variant hover:shadow-md",
      className,
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <p className="font-manrope text-[12px] font-bold uppercase tracking-wide text-on-surface-variant">
        {label}
      </p>
    </div>
    <p className="mt-1 font-newsreader text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
      {value}
    </p>
    {hint && (
      <p
        className={cn(
          "mt-0.5 font-manrope text-[11px] font-semibold",
          hintToneClass[hintTone],
        )}
      >
        {hint}
      </p>
    )}
    {children && (
      <div className={cn("mt-3 min-h-0 flex-1", slotClassName)}>{children}</div>
    )}
  </div>
);

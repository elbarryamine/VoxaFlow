import { cn } from "@/src/shared/utils/cn";

type HintTone = "positive" | "negative" | "neutral";

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  hintTone?: HintTone;
  icon?: React.ReactNode;
  children?: React.ReactNode;
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
  icon,
  children,
  className,
}: KpiCardProps) => (
  <div
    className={cn(
      "flex flex-col rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:border-outline-variant hover:shadow-md sm:p-6",
      className,
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <p className="font-manrope text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
        {label}
      </p>
      {icon}
    </div>
    <p className="mt-2 font-newsreader text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
      {value}
    </p>
    {hint && (
      <p
        className={cn(
          "mt-1 font-manrope text-[12px] font-semibold",
          hintToneClass[hintTone],
        )}
      >
        {hint}
      </p>
    )}
    {children && <div className="mt-4 flex-1">{children}</div>}
  </div>
);

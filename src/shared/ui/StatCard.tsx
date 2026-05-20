interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}

export const StatCard = ({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatCardProps) => {
  const changeColor = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-on-surface-variant",
  }[changeType];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-outline-variant hover:shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-manrope font-semibold tracking-wide text-on-surface-variant">{label}</p>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container/60 text-on-secondary-container transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-4xl font-newsreader font-bold tracking-tight text-on-surface">{value}</p>
      {change && (
        <p className={`mt-2 font-manrope text-[13px] font-bold ${changeColor}`}>{change}</p>
      )}
    </div>
  );
};

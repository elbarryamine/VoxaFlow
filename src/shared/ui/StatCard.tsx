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
    negative: "text-danger",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {change && (
        <p className={`mt-1 text-sm font-medium ${changeColor}`}>{change}</p>
      )}
    </div>
  );
};

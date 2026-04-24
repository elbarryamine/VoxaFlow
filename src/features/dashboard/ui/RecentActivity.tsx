import {
  Robot,
  CheckCircle,
  XCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr";

const ACTIVITIES = [
  {
    id: "1",
    agent: "Sales Qualifier",
    action: "Qualified lead from Shopify webhook — booked meeting",
    outcome: "qualified",
    time: "2 min ago",
  },
  {
    id: "2",
    agent: "Support Triage",
    action: "Resolved ticket #4821 automatically",
    outcome: "resolved",
    time: "8 min ago",
  },
  {
    id: "3",
    agent: "Sales Qualifier",
    action: "Lead scoring failed — missing intent data",
    outcome: "failed",
    time: "15 min ago",
  },
  {
    id: "4",
    agent: "Appointment Setter",
    action: "Rescheduled appointment for Dr. Martin",
    outcome: "resolved",
    time: "1 hour ago",
  },
  {
    id: "5",
    agent: "Support Triage",
    action: "Escalated issue #4819 to human agent",
    outcome: "pending",
    time: "2 hours ago",
  },
];

const OUTCOME_ICON = {
  qualified: <CheckCircle className="h-4 w-4 text-success" />,
  resolved: <CheckCircle className="h-4 w-4 text-success" />,
  failed: <XCircle className="h-4 w-4 text-danger" />,
  pending: <Clock className="h-4 w-4 text-warning" />,
} as const;

export const RecentActivity = () => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 px-6 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Robot className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{activity.action}</p>
              <p className="text-xs text-muted-foreground">{activity.agent}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {OUTCOME_ICON[activity.outcome as keyof typeof OUTCOME_ICON]}
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

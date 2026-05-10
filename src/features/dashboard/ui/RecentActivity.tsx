import {
  Pulse,
  CheckCircle,
  XCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr";

const ACTIVITIES = [
  {
    id: "1",
    workflow: "Sales Lead Qualifier",
    action: "Data synced from Shopify to CRM — 4 leads processed",
    outcome: "success",
    time: "2 min ago",
  },
  {
    id: "2",
    workflow: "Support Ticket Triage",
    action: "Classified 12 tickets — 3 high priority escalated",
    outcome: "success",
    time: "8 min ago",
  },
  {
    id: "3",
    workflow: "Sales Lead Qualifier",
    action: "API connection timeout during sync",
    outcome: "failed",
    time: "15 min ago",
  },
  {
    id: "4",
    workflow: "Appointment Reminder",
    action: "Slack notification sent to #support channel",
    outcome: "success",
    time: "1 hour ago",
  },
  {
    id: "5",
    workflow: "Support Ticket Triage",
    action: "Waiting for database response",
    outcome: "pending",
    time: "2 hours ago",
  },
];

const OUTCOME_ICON = {
  success: <CheckCircle className="h-4 w-4 text-success" />,
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
              <Pulse className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{activity.action}</p>
              <p className="text-xs text-muted-foreground">{activity.workflow}</p>
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

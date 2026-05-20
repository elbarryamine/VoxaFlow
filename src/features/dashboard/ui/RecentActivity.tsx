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
    <div className="rounded-2xl border border-border/50 bg-card font-manrope shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
        <h3 className="font-newsreader text-xl font-bold text-on-surface">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border/40">
        {ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="group flex items-center gap-5 px-6 py-4 transition-colors hover:bg-surface-variant/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/40 text-on-primary-container transition-transform duration-300 group-hover:scale-110">
              <Pulse className="h-5 w-5" weight="duotone" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-on-surface">{activity.action}</p>
              <p className="mt-1 text-[13px] font-medium text-on-surface-variant">{activity.workflow}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              {OUTCOME_ICON[activity.outcome as keyof typeof OUTCOME_ICON]}
              <span className="text-[13px] font-semibold text-on-surface-variant">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

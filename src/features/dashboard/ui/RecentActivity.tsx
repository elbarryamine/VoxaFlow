import Link from "next/link";
import {
  Pulse,
  CheckCircle,
  XCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import type { ActivityItem } from "@/src/features/dashboard/types/Dashboard.types";

const OUTCOME_ICON = {
  success: <CheckCircle className="h-4 w-4 text-success" weight="fill" />,
  failed: <XCircle className="h-4 w-4 text-error" weight="fill" />,
  pending: <Clock className="h-4 w-4 text-warning" weight="duotone" />,
} as const;

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="rounded-2xl border border-border/50 bg-card font-manrope shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
        <h3 className="font-newsreader text-xl font-bold text-on-surface">
          Recent Activity
        </h3>
        {activities.length > 0 && (
          <Link
            href="/dashboard/executions"
            className="text-[13px] font-bold text-primary hover:text-primary/80"
          >
            View all
          </Link>
        )}
      </div>
      {activities.length === 0 ? (
        <p className="px-6 py-10 text-center text-[14px] font-medium text-on-surface-variant">
          Activity from your workflow runs will appear here.
        </p>
      ) : (
        <div className="divide-y divide-border/40">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/dashboard/executions/${activity.id}`}
              className="group flex items-center gap-5 px-6 py-4 transition-colors hover:bg-surface-variant/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant transition-transform duration-300 group-hover:scale-105">
                <Pulse className="h-5 w-5" weight="duotone" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-on-surface">
                  {activity.action}
                </p>
                <p className="mt-1 truncate text-[13px] font-medium text-on-surface-variant">
                  {activity.workflow}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                {OUTCOME_ICON[activity.outcome]}
                <span className="text-[13px] font-semibold text-on-surface-variant">
                  {activity.time}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

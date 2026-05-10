"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Timer,
  DotsThreeVertical,
} from "@phosphor-icons/react/dist/ssr";
import type { Execution } from "../types/Execution.types";
import { cn } from "@/src/shared/utils/cn";

interface ExecutionCardProps {
  execution: Execution;
}

const STATUS_CONFIG = {
  success: {
    label: "Success",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  running: {
    label: "Running",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: PlayCircle,
  },
  waiting: {
    label: "Waiting",
    className: "bg-muted/10 text-muted-foreground border-muted/20",
    icon: Timer,
  },
} as const;

export const ExecutionCard = ({ execution }: ExecutionCardProps) => {
  const config = STATUS_CONFIG[execution.status];
  const Icon = config.icon;

  return (
    <Link
      href={`/dashboard/executions/${execution.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm",
            config.className
          )}>
            <Icon weight="duotone" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground group-hover:text-primary">
              {execution.workflowName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                ID: {execution.id}
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-[11px] font-medium text-muted-foreground">
                {execution.trigger}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="rounded-lg p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-secondary-foreground group-hover:opacity-100"
        >
          <DotsThreeVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{new Date(execution.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5" />
            <span>{execution.duration}</span>
          </div>
        </div>
        <span className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
          config.className
        )}>
          {config.label}
        </span>
      </div>
    </Link>
  );
};

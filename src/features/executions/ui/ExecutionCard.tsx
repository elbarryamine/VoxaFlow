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
      className="group block rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-outline-variant hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
            config.className
          )}>
            <Icon weight="duotone" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-newsreader text-[19px] font-bold text-on-surface transition-colors group-hover:text-primary">
              {execution.workflowName}
            </h3>
            <div className="mt-0.5 flex items-center gap-2 font-manrope">
              <span className="text-[12px] font-bold uppercase tracking-widest text-on-surface-variant">
                ID: {execution.id}
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-[13px] font-medium text-on-surface-variant">
                {execution.trigger}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="rounded-xl p-1.5 text-on-surface-variant opacity-0 transition-all hover:bg-surface-variant hover:text-on-surface group-hover:opacity-100"
        >
          <DotsThreeVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 font-manrope text-sm text-on-surface-variant">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" weight="duotone" />
            <span className="font-medium">{new Date(execution.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" weight="duotone" />
            <span className="font-medium">{execution.duration}</span>
          </div>
        </div>
        <span className={cn(
          "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest",
          config.className
        )}>
          {config.label}
        </span>
      </div>
    </Link>
  );
};

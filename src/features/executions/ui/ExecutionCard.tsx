"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Timer,
  DotsThreeVertical,
  GitBranch,
} from "@phosphor-icons/react/dist/ssr";
import type { Execution } from "../types/Execution.types";
import { cn } from "@/src/shared/utils/cn";

interface ExecutionCardProps {
  execution: Execution;
}

const STATUS_CONFIG = {
  success: {
    label: "Success",
    railClass: "border-success/40",
    iconClass: "bg-success/10 text-success group-hover:bg-success group-hover:text-white",
    pillClass: "bg-success/15 text-success",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    railClass: "border-error/40",
    iconClass: "bg-error/10 text-error group-hover:bg-error group-hover:text-on-error",
    pillClass: "bg-error/15 text-error",
    icon: XCircle,
  },
  running: {
    label: "Running",
    railClass: "border-primary/40",
    iconClass: "bg-primary/10 text-primary",
    pillClass: "bg-primary/10 text-primary",
    icon: PlayCircle,
  },
  waiting: {
    label: "Waiting",
    railClass: "border-outline-variant/40",
    iconClass: "bg-surface-variant/50 text-on-surface-variant",
    pillClass: "bg-surface-variant/50 text-on-surface-variant",
    icon: Timer,
  },
} as const;

export const ExecutionCard = ({ execution }: ExecutionCardProps) => {
  const config = STATUS_CONFIG[execution.status];
  const Icon = config.icon;

  return (
    <Link
      href={`/dashboard/executions/${execution.id}`}
      className={cn(
        "group block cursor-pointer rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-outline-variant hover:shadow-xl",
        config.railClass,
        "border-l-[3px]",
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl transition-colors", config.iconClass)}>
          <GitBranch weight="duotone" className="h-6 w-6" />
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-tight font-manrope",
          config.pillClass
        )}>
          {config.label}
        </span>
      </div>
      
      <h4 className="text-2xl font-newsreader font-bold text-on-surface mb-1 transition-colors group-hover:text-primary">
        {execution.workflowName}
      </h4>
      <p className="text-[14px] font-manrope font-medium text-on-surface-variant mb-6">
        {execution.trigger}
      </p>
      
      <div className="space-y-3 font-manrope">
        <div className="flex justify-between items-center text-[14px] font-bold border-b border-border/40 pb-2">
          <span className="text-on-surface-variant/70">Execution ID</span>
          <span className="text-on-surface font-mono text-[13px]">#{execution.id.substring(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-center text-[14px] font-bold border-b border-border/40 pb-2">
          <span className="text-on-surface-variant/70">Started At</span>
          <span className="text-on-surface">
            {new Date(execution.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex justify-between items-center text-[14px] font-bold">
          <span className="text-on-surface-variant/70">Duration</span>
          <span className="text-on-surface">{execution.duration}</span>
        </div>
      </div>
    </Link>
  );
};

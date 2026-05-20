"use client";

import Link from "next/link";
import { GitBranch } from "@phosphor-icons/react/dist/ssr";
import type { Execution } from "../types/Execution.types";
import { cn } from "@/src/shared/utils/cn";

type ExecutionCardVariant = "default" | "compact";

interface ExecutionCardProps {
  execution: Execution;
  variant?: ExecutionCardVariant;
}

const STATUS_CONFIG = {
  success: {
    label: "Success",
    railClass: "border-success/40",
    iconClass:
      "bg-success/10 text-success group-hover:bg-success group-hover:text-white",
    pillClass: "bg-success/15 text-success",
  },
  failed: {
    label: "Failed",
    railClass: "border-error/40",
    iconClass:
      "bg-error/10 text-error group-hover:bg-error group-hover:text-on-error",
    pillClass: "bg-error/15 text-error",
  },
  running: {
    label: "Running",
    railClass: "border-primary/40",
    iconClass: "bg-primary/10 text-primary",
    pillClass: "bg-primary/10 text-primary",
  },
  waiting: {
    label: "Waiting",
    railClass: "border-outline-variant/40",
    iconClass: "bg-surface-variant/50 text-on-surface-variant",
    pillClass: "bg-surface-variant/50 text-on-surface-variant",
  },
} as const;

export const ExecutionCard = ({
  execution,
  variant = "default",
}: ExecutionCardProps) => {
  const config = STATUS_CONFIG[execution.status];
  const isCompact = variant === "compact";
  const shortId = execution.id.substring(0, 8).toUpperCase();
  const startedAt = new Date(execution.startedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/dashboard/executions/${execution.id}`}
      className={cn(
        "group block cursor-pointer border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-outline-variant",
        config.railClass,
        "border-l-[3px]",
        isCompact
          ? "rounded-xl p-3.5 hover:shadow-md"
          : "rounded-2xl p-6 hover:shadow-xl",
      )}
    >
      {isCompact ? (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
              config.iconClass,
            )}
          >
            <GitBranch weight="duotone" className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="truncate font-newsreader text-[15px] font-bold text-on-surface transition-colors group-hover:text-primary">
                {execution.workflowName}
              </h4>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 font-manrope text-[10px] font-bold uppercase tracking-wide",
                  config.pillClass,
                )}
              >
                {config.label}
              </span>
            </div>
            <p className="mt-0.5 truncate font-manrope text-[12px] font-medium text-on-surface-variant">
              {execution.trigger} · {startedAt} · {execution.duration} · #
              {shortId}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between">
            <div
              className={cn(
                "rounded-xl p-2.5 transition-colors",
                config.iconClass,
              )}
            >
              <GitBranch weight="duotone" className="h-6 w-6" />
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 font-manrope text-[12px] font-bold uppercase tracking-tight",
                config.pillClass,
              )}
            >
              {config.label}
            </span>
          </div>

          <h4 className="mb-1 font-newsreader text-2xl font-bold text-on-surface transition-colors group-hover:text-primary">
            {execution.workflowName}
          </h4>
          <p className="mb-6 font-manrope text-[14px] font-medium text-on-surface-variant">
            {execution.trigger}
          </p>

          <div className="space-y-3 font-manrope">
            <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[14px] font-bold">
              <span className="text-on-surface-variant/70">Execution ID</span>
              <span className="font-mono text-[13px] text-on-surface">
                #{shortId}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[14px] font-bold">
              <span className="text-on-surface-variant/70">Started At</span>
              <span className="text-on-surface">{startedAt}</span>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold">
              <span className="text-on-surface-variant/70">Duration</span>
              <span className="text-on-surface">{execution.duration}</span>
            </div>
          </div>
        </>
      )}
    </Link>
  );
};

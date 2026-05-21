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
          ? "rounded-xl p-3 hover:shadow-md"
          : "rounded-xl p-3.5 hover:shadow-lg sm:p-4",
      )}
    >
      {isCompact ? (
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
              config.iconClass,
            )}
          >
            <GitBranch weight="duotone" className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="truncate font-newsreader text-[14px] font-bold text-on-surface transition-colors group-hover:text-primary">
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
            <p className="mt-0.5 truncate font-manrope text-[11px] font-medium text-on-surface-variant">
              {execution.trigger} · {startedAt} · {execution.duration} · #
              {shortId}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-start justify-between gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                config.iconClass,
              )}
            >
              <GitBranch weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-manrope text-[10px] font-bold uppercase tracking-wide sm:text-[11px]",
                config.pillClass,
              )}
            >
              {config.label}
            </span>
          </div>

          <h4 className="mb-0.5 line-clamp-2 font-newsreader text-lg font-bold leading-snug text-on-surface transition-colors group-hover:text-primary sm:text-xl">
            {execution.workflowName}
          </h4>
          <p className="mb-3 font-manrope text-[12px] font-medium text-on-surface-variant">
            {execution.trigger}
          </p>

          <div className="space-y-1.5 font-manrope">
            <DetailRow label="Execution ID" value={`#${shortId}`} mono />
            <DetailRow label="Started At" value={startedAt} />
            <DetailRow label="Duration" value={execution.duration} last />
          </div>
        </>
      )}
    </Link>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}

const DetailRow = ({ label, value, mono, last }: DetailRowProps) => (
  <div
    className={cn(
      "flex items-center justify-between pb-1.5 text-[12px] font-bold sm:text-[13px]",
      !last && "border-b border-border/40",
    )}
  >
    <span className="text-on-surface-variant/70">{label}</span>
    <span
      className={cn("text-on-surface", mono && "font-mono text-[11px] sm:text-[12px]")}
    >
      {value}
    </span>
  </div>
);

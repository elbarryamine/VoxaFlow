"use client";

import Link from "next/link";
import { GitBranch, DotsThreeVertical } from "@phosphor-icons/react/dist/ssr";
import type { Workflow } from "../types/Workflow.types";
import { cn } from "@/src/shared/utils/cn";

type WorkflowCardVariant = "default" | "compact";

interface WorkflowCardProps {
  workflow: Workflow;
  variant?: WorkflowCardVariant;
}

const STATUS_CONFIG = {
  active: {
    label: "Active",
    railClass: "border-success/40",
    iconClass:
      "bg-success/15 text-success group-hover:bg-success group-hover:text-white",
    pillClass: "bg-success/15 text-success",
  },
  inactive: {
    label: "Inactive",
    railClass: "border-outline-variant/40",
    iconClass:
      "bg-surface-variant/40 text-on-surface-variant group-hover:bg-surface-variant group-hover:text-on-surface",
    pillClass: "bg-surface-variant/50 text-on-surface-variant",
  },
} as const;

const toolbarIconClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-surface-variant hover:text-on-surface";

export const WorkflowCard = ({
  workflow,
  variant = "default",
}: WorkflowCardProps) => {
  const statusKey = workflow.is_active ? "active" : "inactive";
  const config = STATUS_CONFIG[statusKey];
  const isCompact = variant === "compact";
  const runsCount = workflow.runsCount ?? 0;
  const lastRun = workflow.lastRun ?? "—";
  const shortId = workflow.id.substring(0, 8).toUpperCase();
  const subtitle =
    workflow.description?.trim() ||
    workflow.profileName?.trim() ||
    "No description";

  return (
    <Link
      href={`/dashboard/workflows/${workflow.id}`}
      className={cn(
        "group flex cursor-pointer border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-outline-variant",
        config.railClass,
        "border-l-[3px]",
        isCompact
          ? "gap-2.5 rounded-xl p-3 hover:shadow-md"
          : "gap-3 rounded-xl p-3 hover:shadow-lg sm:gap-3.5 sm:p-3.5",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-col items-center",
          isCompact ? "w-10 gap-1" : "w-11 gap-1.5 sm:w-12",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-xl transition-colors duration-300",
            isCompact ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10",
            config.iconClass,
          )}
        >
          <GitBranch
            weight="duotone"
            className={isCompact ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"}
          />
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-center font-manrope font-bold uppercase tracking-wide",
            isCompact ? "text-[9px]" : "text-[10px] sm:text-[11px]",
            config.pillClass,
          )}
        >
          {config.label}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className={cn(
            "flex items-start justify-between gap-2",
            isCompact ? "mb-0.5" : "mb-1",
          )}
        >
          <h3
            className={cn(
              "font-newsreader font-bold tracking-tight text-on-surface transition-colors duration-300 group-hover:text-primary",
              isCompact
                ? "line-clamp-1 text-[15px]"
                : "line-clamp-2 text-lg leading-snug sm:text-xl",
            )}
          >
            {workflow.name}
          </h3>
          {!isCompact && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="Workflow actions"
              className={toolbarIconClass}
            >
              <DotsThreeVertical className="h-4 w-4" weight="bold" />
            </button>
          )}
        </div>

        {isCompact ? (
          <p className="truncate font-manrope text-[12px] font-medium text-on-surface-variant">
            {runsCount.toLocaleString()} runs · {lastRun} · #{shortId}
          </p>
        ) : (
          <>
            <p className="mb-2 line-clamp-2 font-manrope text-[12px] font-medium text-on-surface-variant">
              {subtitle}
            </p>
            <div className="mt-auto grid grid-cols-3 divide-x divide-border/40 rounded-xl bg-surface-variant/25 font-manrope">
              <MetricCell label="Runs" value={runsCount.toLocaleString()} />
              <MetricCell label="Last run" value={lastRun} />
              <MetricCell label="ID" value={`#${shortId}`} mono />
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

interface MetricCellProps {
  label: string;
  value: string;
  mono?: boolean;
}

const MetricCell = ({ label, value, mono }: MetricCellProps) => (
  <div className="px-1.5 py-1.5 text-center sm:px-2 sm:py-2">
    <p className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant/70">
      {label}
    </p>
    <p
      className={cn(
        "mt-0.5 truncate text-[12px] font-bold text-on-surface sm:text-[13px]",
        mono && "font-mono text-[11px] sm:text-[12px]",
      )}
      title={value}
    >
      {value}
    </p>
  </div>
);

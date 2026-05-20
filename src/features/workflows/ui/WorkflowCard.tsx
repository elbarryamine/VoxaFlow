"use client";

import Link from "next/link";
import { GitBranch, DotsThreeVertical } from "@phosphor-icons/react/dist/ssr";
import type { Workflow } from "../types/Workflow.types";
import { cn } from "@/src/shared/utils/cn";

interface WorkflowCardProps {
  workflow: Workflow;
}

// Align status styling with ExecutionCard for consistency
const STATUS_CONFIG = {
  active: {
    label: "Active",
    containerClass: "",
    iconClass: "bg-surface-variant/40 text-on-surface group-hover:bg-primary group-hover:text-on-primary",
    pillClass: "bg-secondary-container/40 text-on-secondary-container",
  },
  inactive: {
    label: "Inactive",
    containerClass: "",
    iconClass: "bg-surface-variant/40 text-on-surface group-hover:bg-primary group-hover:text-on-primary",
    pillClass: "bg-surface-variant/50 text-on-surface-variant",
  },
  draft: {
    label: "Draft",
    containerClass: "",
    iconClass: "bg-surface-variant/40 text-on-surface group-hover:bg-primary group-hover:text-on-primary",
    pillClass: "bg-surface-variant/80 text-on-surface-variant",
  },
} as const;

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const statusKey = workflow.is_active ? "active" : "inactive";
  const config = STATUS_CONFIG[statusKey];
  const runsCount = workflow.runsCount ?? 0;
  const lastRun = workflow.lastRun ?? "—";

  return (
    <Link
      href={`/dashboard/workflows/${workflow.id}`}
      className={cn(
        "bg-card border border-border/50 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer group block",
        config.containerClass
      )}
    >
      <div className="flex items-start gap-4">
        {/* Left column – icon and status pill */}
        <div className="flex flex-col items-center">
          <div className={cn("p-3 rounded-xl transition-colors", config.iconClass)}>
            <GitBranch weight="duotone" className="h-6 w-6" />
          </div>
          <span
            className={cn(
              "mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest font-manrope",
              config.pillClass
            )}
          >
            {config.label}
          </span>
        </div>

        {/* Center column – title & description */}
        <div className="min-w-0 flex-1">
          <h3 className="font-newsreader text-xl font-bold text-on-surface">
            {workflow.name}
          </h3>
          {workflow.description && (
            <p className="mt-1 text-sm font-manrope text-on-surface-variant">
              {workflow.description}
            </p>
          )}
        </div>

        {/* Right column – actions & stats */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex h-7 items-center justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="Workflow actions"
              className="rounded-full bg-surface-variant/30 p-1.5 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
            >
              <DotsThreeVertical className="h-4 w-4" weight="bold" />
            </button>
          </div>
          <div className="flex flex-col items-end space-y-1 text-sm font-manrope text-on-surface-variant">
            <div>
              <span className="text-on-surface-variant/70">ID</span>{" "}
              <span className="text-on-surface font-mono">#{workflow.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div>
              <span className="text-on-surface-variant/70">Runs</span>{" "}
              <span className="text-on-surface">{runsCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-on-surface-variant/70">Last</span>{" "}
              <span className="text-on-surface">{lastRun}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

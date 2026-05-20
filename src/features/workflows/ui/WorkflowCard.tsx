"use client";

import Link from "next/link";
import {
  GitBranch,
  Play,
  Clock,
  DotsThreeVertical,
} from "@phosphor-icons/react/dist/ssr";
import type { Workflow } from "../types/Workflow.types";

interface WorkflowCardProps {
  workflow: Workflow;
}

const STATUS_STYLES = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted/10 text-muted-foreground",
  draft: "bg-warning/10 text-warning",
} as const;

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const status = workflow.is_active ? "active" : "inactive";
  const runsCount = workflow.runsCount || 0;
  const lastRun = workflow.lastRun || "No runs";

  return (
    <Link
      href={`/dashboard/workflows/${workflow.id}`}
      className="group block rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-outline-variant hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container/60 transition-colors group-hover:bg-secondary-container">
            <GitBranch className="h-6 w-6 text-on-secondary-container" weight="duotone" />
          </div>
          <div>
            <h3 className="font-newsreader text-[20px] font-bold text-on-surface transition-colors group-hover:text-primary">
              {workflow.name}
            </h3>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 font-manrope text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}
            >
              {status}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="rounded-xl p-1.5 text-on-surface-variant opacity-0 transition-all hover:bg-surface-variant hover:text-on-surface group-hover:opacity-100"
        >
          <DotsThreeVertical className="h-5 w-5" />
        </button>
      </div>

      {workflow.profileName && (
        <div className="mt-5 flex items-center gap-2">
          <span className="rounded-lg bg-surface-variant px-2.5 py-1 font-manrope text-[12px] font-semibold text-on-surface-variant">
            {workflow.profileName}
          </span>
        </div>
      )}

      <div className="mt-5 flex items-center gap-6 font-manrope text-[14px] text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4" weight="duotone" />
          <span className="font-medium">{runsCount.toLocaleString()} runs</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" weight="duotone" />
          <span className="font-medium">{lastRun}</span>
        </div>
      </div>
    </Link>
  );
};

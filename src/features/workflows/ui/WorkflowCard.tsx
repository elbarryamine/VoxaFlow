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
      className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary">
              {workflow.name}
            </h3>
            <span
              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
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
          className="rounded-lg p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-secondary-foreground group-hover:opacity-100"
        >
          <DotsThreeVertical className="h-4 w-4" />
        </button>
      </div>

      {workflow.profileName && (
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-primary">
            {workflow.profileName}
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Play className="h-3.5 w-3.5" />
          <span>{runsCount.toLocaleString()} runs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{lastRun}</span>
        </div>
      </div>
    </Link>
  );
};

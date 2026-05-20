"use client";

import Link from "next/link";
import {
  GitBranch,
  DotsThreeVertical,
} from "@phosphor-icons/react/dist/ssr";
import type { Workflow } from "../types/Workflow.types";
import { cn } from "@/src/shared/utils/cn";

interface WorkflowCardProps {
  workflow: Workflow;
}

const STATUS_CONFIG = {
  active: {
    label: "Active",
    iconClass: "bg-surface-variant/40 text-on-surface group-hover:bg-primary group-hover:text-on-primary",
    pillClass: "bg-secondary-container/40 text-on-secondary-container",
  },
  inactive: {
    label: "Inactive",
    iconClass: "bg-surface-variant/40 text-on-surface group-hover:bg-primary group-hover:text-on-primary",
    pillClass: "bg-surface-variant/50 text-on-surface-variant",
  },
  draft: {
    label: "Draft",
    iconClass: "bg-surface-variant/40 text-on-surface group-hover:bg-primary group-hover:text-on-primary",
    pillClass: "bg-surface-variant/80 text-on-surface-variant",
  }
} as const;

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const status = workflow.is_active ? "active" : "inactive";
  const config = STATUS_CONFIG[status];
  const runsCount = workflow.runsCount || 0;
  const lastRun = workflow.lastRun || "No runs";

  return (
    <Link
      href={`/dashboard/workflows/${workflow.id}`}
      className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer group block relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl transition-colors", config.iconClass)}>
          <GitBranch weight="duotone" className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-tight font-manrope",
            config.pillClass
          )}>
            {config.label}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="rounded-xl p-1.5 text-on-surface-variant opacity-0 transition-all hover:bg-surface-variant hover:text-on-surface group-hover:opacity-100"
          >
            <DotsThreeVertical className="h-5 w-5" weight="bold" />
          </button>
        </div>
      </div>
      
      <h4 className="text-2xl font-newsreader font-bold text-on-surface mb-1 transition-colors group-hover:text-primary">
        {workflow.name}
      </h4>
      <p className="text-[14px] font-manrope font-medium text-on-surface-variant mb-6 min-h-[20px]">
        {workflow.profileName ? workflow.profileName : "No profile"}
      </p>
      
      <div className="space-y-3 font-manrope">
        <div className="flex justify-between items-center text-[14px] font-bold border-b border-border/40 pb-2">
          <span className="text-on-surface-variant/70">Workflow ID</span>
          <span className="text-on-surface font-mono text-[13px]">#{workflow.id.substring(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-center text-[14px] font-bold border-b border-border/40 pb-2">
          <span className="text-on-surface-variant/70">Total Runs</span>
          <span className="text-on-surface">{runsCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[14px] font-bold">
          <span className="text-on-surface-variant/70">Last Run</span>
          <span className="text-on-surface">{lastRun}</span>
        </div>
      </div>
    </Link>
  );
};

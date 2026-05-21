"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  GitBranch,
  DotsThreeVerticalIcon,
  TrashIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Workflow } from "../types/Workflow.types";
import { cn } from "@/src/shared/utils/cn";
import { ConfirmationModal } from "@/src/shared/ui/ConfirmationModal";
import { useWorkflowActions } from "../hooks/useWorkflowActions";

type WorkflowCardVariant = "default" | "compact";

interface WorkflowCardProps {
  workflow: Workflow;
  variant?: WorkflowCardVariant;
  onDeleted?: (id: string) => void;
}

const STATUS_TAG = {
  active: {
    label: "Active",
    className: "bg-success/10 text-success",
  },
  inactive: {
    label: "Inactive",
    className: "bg-surface-variant/60 text-on-surface-variant",
  },
} as const;

const cardClass =
  "group flex cursor-pointer rounded-lg border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-outline-variant hover:shadow-md";

const iconClass =
  "flex shrink-0 items-center justify-center rounded-lg bg-secondary-container/60 text-on-secondary-container transition-transform duration-300 group-hover:scale-105";

const titleClass =
  "font-newsreader font-bold tracking-tight text-on-surface transition-colors duration-300 group-hover:text-primary";

const statusTagClass =
  "inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 font-manrope text-[10px] font-bold uppercase tracking-wide sm:text-[11px]";

const toolbarIconClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-on-surface-variant transition-all duration-300 opacity-100 hover:bg-surface-variant hover:text-on-surface sm:opacity-0 sm:group-hover:opacity-100";

export const WorkflowCard = ({
  workflow,
  variant = "default",
  onDeleted,
}: WorkflowCardProps) => {
  const statusKey = workflow.is_active ? "active" : "inactive";
  const status = STATUS_TAG[statusKey];
  const isCompact = variant === "compact";
  const runsCount = workflow.runsCount ?? 0;
  const lastRun = workflow.lastRun ?? "—";
  const shortId = workflow.id.substring(0, 8).toUpperCase();
  const updatedAt = new Date(workflow.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const { actionState, deleteWorkflow } = useWorkflowActions(onDeleted);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (isCompact) {
    return (
      <Link
        href={`/dashboard/workflows/${workflow.id}`}
        className={cn(cardClass, "items-center gap-2.5 p-3")}
      >
        <div className={cn(iconClass, "h-8 w-8")}>
          <GitBranch weight="duotone" className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className={cn(titleClass, "truncate text-[15px]")}>
              {workflow.name}
            </h3>
            <span className={cn(statusTagClass, status.className)}>
              {status.label}
            </span>
          </div>
          <p className="mt-0.5 truncate font-manrope text-[11px] font-medium text-on-surface-variant">
            {runsCount.toLocaleString()} runs · {lastRun} · #{shortId}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <>
      <Link
        href={`/dashboard/workflows/${workflow.id}`}
        className={cn(cardClass, "flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-4")}
      >
        <div className="flex items-start gap-3">
          <div className={cn(iconClass, "h-9 w-9 sm:h-10 sm:w-10")}>
            <GitBranch weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className={cn(
                    titleClass,
                    "line-clamp-2 text-base leading-snug sm:text-[17px]",
                  )}
                >
                  {workflow.name}
                </h3>
                <p className="mt-0.5 font-manrope text-[11px] font-semibold text-on-surface-variant sm:text-[12px]">
                  {runsCount.toLocaleString()} runs · Last run {lastRun}
                </p>
              </div>

              <WorkflowActionsMenu
                isLoading={actionState === "loading"}
                onDeleteRequest={() => setDeleteModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/40 pt-2 font-manrope text-[10px] font-semibold text-on-surface-variant sm:text-[11px]">
          <span className={cn(statusTagClass, status.className)}>
            {status.label}
          </span>
          <MetaDivider />
          <span className="truncate">Updated {updatedAt}</span>
          <MetaDivider />
          <span className="truncate font-mono text-[10px] text-on-surface/90">
            #{shortId}
          </span>
        </footer>
      </Link>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          void deleteWorkflow(workflow.id);
        }}
        title="Delete workflow"
        message={`"${workflow.name}" and all its executions will be permanently deleted. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Actions menu
// ---------------------------------------------------------------------------

interface WorkflowActionsMenuProps {
  isLoading: boolean;
  onDeleteRequest: () => void;
}

const WorkflowActionsMenu = ({
  isLoading,
  onDeleteRequest,
}: WorkflowActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        disabled={isLoading}
        aria-label="Workflow actions"
        className={cn(
          toolbarIconClass,
          isLoading && "cursor-not-allowed opacity-50",
        )}
      >
        {isLoading ? (
          <SpinnerGapIcon className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <DotsThreeVerticalIcon className="h-3.5 w-3.5" weight="bold" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-40 overflow-hidden rounded-lg border border-border/60 bg-card shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDeleteRequest();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 font-manrope text-[12px] font-semibold text-error/80 transition-colors hover:bg-error/5 hover:text-error"
          >
            <TrashIcon className="h-3.5 w-3.5" weight="bold" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------

const MetaDivider = () => (
  <span aria-hidden className="text-on-surface-variant/35">
    ·
  </span>
);

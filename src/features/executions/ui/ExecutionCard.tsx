"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Pulse,
  GitBranch,
  ArrowSquareOut,
  CaretRight,
  DotsThreeIcon,
  TrashIcon,
  ArrowClockwiseIcon,
  StopCircleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react/dist/ssr";
import type {
  Execution,
  ExecutionNodeStep,
} from "../types/Execution.types";
import { cn } from "@/src/shared/utils/cn";
import { useExecutionActions } from "../hooks/useExecutionActions";
import { ConfirmationModal } from "@/src/shared/ui/ConfirmationModal";

type ExecutionCardVariant = "default" | "compact";

interface ExecutionCardProps {
  execution: Execution;
  variant?: ExecutionCardVariant;
  onDeleted?: (id: string) => void;
  onCancelled?: (id: string) => void;
  onRerun?: () => void;
}

const STATUS_TAG = {
  success: {
    label: "Success",
    className: "bg-success/10 text-success",
  },
  failed: {
    label: "Failed",
    className: "bg-error/10 text-error",
  },
  running: {
    label: "Running",
    className: "bg-primary/10 text-primary",
  },
  waiting: {
    label: "Waiting",
    className: "bg-surface-variant/60 text-on-surface-variant",
  },
} as const;

const STEP_DOT = {
  success: "border-success bg-success",
  failed: "border-error bg-error ring-2 ring-error/25",
  running: "border-primary bg-primary animate-pulse",
  pending: "border-outline-variant/60 bg-surface-variant",
  skipped: "border-outline-variant/40 bg-transparent",
} as const;

const cardShell =
  "group relative flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-outline-variant hover:shadow-md";

const statusTagClass =
  "inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 font-manrope text-[10px] font-bold uppercase tracking-wide sm:text-[11px]";

const sectionLabelClass =
  "font-manrope text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/70 sm:text-[10px]";

export const ExecutionCard = ({
  execution,
  variant = "default",
  onDeleted,
  onCancelled,
  onRerun,
}: ExecutionCardProps) => {
  const router = useRouter();
  const status = STATUS_TAG[execution.status];
  const isCompact = variant === "compact";
  const shortId = execution.id.substring(0, 8).toUpperCase();
  const startedAt = new Date(execution.startedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const workflowHref = `/dashboard/workflows/${execution.workflowId}`;
  const executionHref = `/dashboard/executions/${execution.id}`;

  const { actionState, deleteExecution, cancelExecution, rerunExecution } =
    useExecutionActions(onDeleted, onCancelled, (newId) => {
      onRerun?.();
      router.push(`/dashboard/executions/${newId}`);
    });

  const isActive =
    execution.status === "running" || execution.status === "waiting";

  const actions = (
    <ExecutionActionsMenu
      isLoading={actionState === "loading"}
      canDelete={!isActive}
      canCancel={isActive}
      canRerun={!isActive}
      onDelete={() => void deleteExecution(execution.id)}
      onCancel={() => void cancelExecution(execution.id)}
      onRerun={() => void rerunExecution(execution)}
    />
  );

  if (isCompact) {
    return (
      <article className={cardShell}>
        <div className="flex items-stretch">
          <Link href={executionHref} className="flex flex-1 flex-col gap-2 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Pulse
                  weight="duotone"
                  className="h-4 w-4 shrink-0 text-secondary"
                />
                <span className="truncate font-mono text-[11px] font-bold text-on-surface-variant">
                  #{shortId}
                </span>
                <span className={cn(statusTagClass, status.className)}>
                  {status.label}
                </span>
              </div>
              <span className="shrink-0 font-manrope text-[11px] font-semibold text-on-surface-variant">
                {execution.duration}
              </span>
            </div>

            <WorkflowRelation
              workflowName={execution.workflowName}
              workflowHref={workflowHref}
              compact
            />

            <NodePathStrip
              nodePath={execution.nodePath}
              failedNodeId={execution.failedNodeId}
              compact
            />
          </Link>
          <div className="flex shrink-0 items-start p-2 pt-2.5">{actions}</div>
        </div>
      </article>
    );
  }

  return (
    <article className={cardShell}>
      <header className="flex items-start justify-between gap-3 border-b border-border/40 px-3.5 py-3 sm:px-4">
        <Link href={executionHref} className="flex min-w-0 items-start gap-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-container/50 text-secondary">
            <Pulse weight="duotone" className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className={sectionLabelClass}>Execution run</p>
            <p className="mt-0.5 font-mono text-[13px] font-bold text-on-surface sm:text-sm">
              #{shortId}
            </p>
            <p className="mt-0.5 font-manrope text-[11px] font-medium text-on-surface-variant sm:text-[12px]">
              {execution.trigger} · Started {startedAt} · {execution.duration}
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <span className={cn(statusTagClass, status.className)}>
            {status.label}
          </span>
          {actions}
        </div>
      </header>

      <Link href={executionHref} className="flex flex-col">
        <div className="border-b border-border/40 bg-surface-variant/20 px-3.5 py-2.5 sm:px-4">
          <WorkflowRelation
            workflowName={execution.workflowName}
            workflowHref={workflowHref}
          />
        </div>

        <div className="px-3.5 py-3 sm:px-4 sm:py-3.5">
          <p className={cn(sectionLabelClass, "mb-2")}>Path executed</p>
          <NodePathStrip
            nodePath={execution.nodePath}
            failedNodeId={execution.failedNodeId}
          />
        </div>
      </Link>
    </article>
  );
};

// ---------------------------------------------------------------------------
// Actions menu
// ---------------------------------------------------------------------------

interface ExecutionActionsMenuProps {
  isLoading: boolean;
  canDelete: boolean;
  canCancel: boolean;
  canRerun: boolean;
  onDelete: () => void;
  onCancel: () => void;
  onRerun: () => void;
}

const ExecutionActionsMenu = ({
  isLoading,
  canDelete,
  canCancel,
  canRerun,
  onDelete,
  onCancel,
  onRerun,
}: ExecutionActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen((o) => !o);
          }}
          disabled={isLoading}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-on-surface-variant transition-colors",
            "hover:border-border/50 hover:bg-surface-variant/50 hover:text-on-surface",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            isLoading && "cursor-not-allowed opacity-50",
          )}
          aria-label="Execution actions"
        >
          {isLoading ? (
            <SpinnerGapIcon className="h-4 w-4 animate-spin" />
          ) : (
            <DotsThreeIcon weight="bold" className="h-4 w-4" />
          )}
        </button>

        {open && (
          <div
            className="absolute right-0 top-full z-50 mt-1 min-w-40 overflow-hidden rounded-lg border border-border/60 bg-card shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {canRerun && (
              <MenuAction
                icon={<ArrowClockwiseIcon className="h-3.5 w-3.5" weight="bold" />}
                label="Re-run"
                onClick={() => {
                  setOpen(false);
                  onRerun();
                }}
              />
            )}
            {canCancel && (
              <MenuAction
                icon={<StopCircleIcon className="h-3.5 w-3.5" weight="bold" />}
                label="Cancel"
                onClick={() => {
                  setOpen(false);
                  onCancel();
                }}
                className="text-warning hover:bg-warning/5"
              />
            )}
            {canDelete && (
              <>
                {(canRerun || canCancel) && (
                  <div className="mx-2 my-1 border-t border-border/40" />
                )}
                <MenuAction
                  icon={<TrashIcon className="h-3.5 w-3.5" weight="bold" />}
                  label="Delete"
                  onClick={() => {
                    setOpen(false);
                    setDeleteModalOpen(true);
                  }}
                  className="text-error/80 hover:bg-error/5 hover:text-error"
                />
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          onDelete();
        }}
        title="Delete execution"
        message="This execution and all its logs will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

interface MenuActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const MenuAction = ({ icon, label, onClick, className }: MenuActionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-2 px-3 py-2 font-manrope text-[12px] font-semibold transition-colors",
      "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface",
      className,
    )}
  >
    {icon}
    {label}
  </button>
);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface WorkflowRelationProps {
  workflowName: string;
  workflowHref: string;
  compact?: boolean;
}

const WorkflowRelation = ({
  workflowName,
  workflowHref,
  compact = false,
}: WorkflowRelationProps) => {
  const inspectLink = (
    <Link
      href={workflowHref}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border border-border/50 bg-card px-2 py-1 font-manrope font-bold text-on-surface-variant transition-colors hover:border-outline-variant hover:bg-surface-variant/50 hover:text-on-surface",
        compact ? "text-[10px]" : "text-[11px]",
      )}
    >
      {compact ? "Inspect" : "Inspect workflow"}
      <ArrowSquareOut className="h-3 w-3" weight="bold" />
    </Link>
  );

  if (compact) {
    return (
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <GitBranch
            weight="duotone"
            className="h-3.5 w-3.5 shrink-0 text-on-surface-variant"
          />
          <Link
            href={workflowHref}
            onClick={(e) => e.stopPropagation()}
            className="truncate font-newsreader text-[13px] font-bold text-on-surface transition-colors hover:text-primary"
          >
            {workflowName}
          </Link>
        </div>
        {inspectLink}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className={sectionLabelClass}>Parent workflow</p>
        <Link
          href={workflowHref}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 inline-flex max-w-full items-center gap-2 transition-colors hover:text-primary"
        >
          <GitBranch
            weight="duotone"
            className="h-4 w-4 shrink-0 text-on-surface-variant"
          />
          <span className="truncate font-newsreader text-[14px] font-bold text-on-surface sm:text-[15px]">
            {workflowName}
          </span>
        </Link>
      </div>
      {inspectLink}
    </div>
  );
};

interface NodePathStripProps {
  nodePath: ExecutionNodeStep[];
  failedNodeId: string | null;
  compact?: boolean;
}

const NodePathStrip = ({
  nodePath,
  failedNodeId,
  compact = false,
}: NodePathStripProps) => {
  if (nodePath.length === 0) {
    return (
      <p className="font-manrope text-[11px] font-medium italic text-on-surface-variant/80">
        Run path will appear once nodes start executing.
      </p>
    );
  }

  const visibleSteps = compact ? nodePath.slice(0, 4) : nodePath;
  const hiddenCount = compact ? Math.max(0, nodePath.length - 4) : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto pb-0.5",
        compact ? "min-w-0" : "flex-wrap gap-y-2",
      )}
    >
      {visibleSteps.map((step, index) => (
        <div key={step.nodeId} className="flex shrink-0 items-center gap-1">
          <StepChip
            step={step}
            isFailed={step.nodeId === failedNodeId}
            compact={compact}
          />
          {index < visibleSteps.length - 1 && (
            <CaretRight
              className="h-3 w-3 shrink-0 text-on-surface-variant/40"
              weight="bold"
              aria-hidden
            />
          )}
        </div>
      ))}
      {hiddenCount > 0 && (
        <span className="shrink-0 rounded-full bg-surface-variant/60 px-1.5 py-0.5 font-manrope text-[10px] font-bold text-on-surface-variant">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

interface StepChipProps {
  step: ExecutionNodeStep;
  isFailed: boolean;
  compact?: boolean;
}

const StepChip = ({ step, isFailed, compact = false }: StepChipProps) => (
  <span
    className={cn(
      "inline-flex max-w-[140px] items-center gap-1.5 rounded-md border px-1.5 py-1 font-manrope font-semibold sm:max-w-[160px]",
      isFailed
        ? "border-error/30 bg-error/5 text-error"
        : "border-border/50 bg-surface-variant/30 text-on-surface",
      compact ? "text-[10px]" : "text-[11px]",
    )}
    title={step.label}
  >
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full border",
        STEP_DOT[step.status],
      )}
      aria-hidden
    />
    <span className="truncate">{step.label}</span>
  </span>
);

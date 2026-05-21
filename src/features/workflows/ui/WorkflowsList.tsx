"use client";

import { useMemo, useState } from "react";
import { GitBranch } from "@phosphor-icons/react/dist/ssr";
import { CardCollectionToolbar } from "@/src/shared/ui/CardCollectionToolbar";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { cn } from "@/src/shared/utils/cn";
import type { CardCollectionViewMode } from "@/src/shared/types/CardCollectionView.types";
import type { Workflow } from "../types/Workflow.types";
import { filterWorkflowBySearch } from "../utils/filterWorkflowBySearch";
import { WorkflowCard } from "./WorkflowCard";

interface WorkflowsListProps {
  workflows: Workflow[];
}

export const WorkflowsList = ({ workflows: initialWorkflows }: WorkflowsListProps) => {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<CardCollectionViewMode>("grid");

  const removeWorkflow = (id: string) =>
    setWorkflows((prev) => prev.filter((w) => w.id !== id));

  const filtered = useMemo(
    () =>
      workflows.filter((workflow) =>
        filterWorkflowBySearch(workflow, searchQuery),
      ),
    [workflows, searchQuery],
  );

  const isListView = viewMode === "list";
  const resultLabel =
    searchQuery.trim().length > 0
      ? `${filtered.length} of ${workflows.length}`
      : `${workflows.length} total`;

  if (workflows.length === 0) {
    return (
      <EmptyState
        layout="page"
        icon={GitBranch}
        title="No workflows yet"
        description="Create your first automation pipeline to process leads, send emails, or trigger AI actions."
      />
    );
  }

  return (
    <>
      <CardCollectionToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchPlaceholder="Search workflows…"
        resultLabel={resultLabel}
      />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-surface-variant/20 px-4 py-8 text-center font-manrope text-[13px] font-medium text-on-surface-variant">
          No workflows match &quot;{searchQuery.trim()}&quot;
        </p>
      ) : (
        <div
          className={cn(
            isListView
              ? "flex flex-col gap-2"
              : "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {filtered.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              variant={isListView ? "compact" : "default"}
              onDeleted={removeWorkflow}
            />
          ))}
        </div>
      )}
    </>
  );
};

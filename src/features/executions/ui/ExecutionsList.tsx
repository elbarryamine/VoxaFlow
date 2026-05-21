"use client";

import { useMemo, useState } from "react";
import { Pulse } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";
import { CardCollectionToolbar } from "@/src/shared/ui/CardCollectionToolbar";
import { cn } from "@/src/shared/utils/cn";
import type { CardCollectionViewMode } from "@/src/shared/types/CardCollectionView.types";
import { ExecutionCard } from "./ExecutionCard";
import { useExecutionsListLive } from "../hooks/useExecutionsListLive";
import { filterExecutionBySearch } from "../utils/filterExecutionBySearch";
import type { Execution } from "../types/Execution.types";

interface ExecutionsListProps {
  initialExecutions: Execution[];
  userId: string;
}

export const ExecutionsList = ({
  initialExecutions,
  userId,
}: ExecutionsListProps) => {
  const { executions, removeExecution, cancelExecution, refetchAll } =
    useExecutionsListLive({ initialExecutions, userId });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<CardCollectionViewMode>("grid");

  const filtered = useMemo(
    () =>
      executions.filter((execution) =>
        filterExecutionBySearch(execution, searchQuery),
      ),
    [executions, searchQuery],
  );

  if (executions.length === 0) {
    return (
      <EmptyState
        layout="page"
        icon={Pulse}
        title="No executions yet"
        description="When your workflows run, their execution history and details will appear here."
        action={
          <TopBarLink href="/dashboard/workflows">Go to workflows</TopBarLink>
        }
      />
    );
  }

  const isListView = viewMode === "list";
  const resultLabel =
    searchQuery.trim().length > 0
      ? `${filtered.length} of ${executions.length}`
      : `${executions.length} total`;

  return (
    <>
      <CardCollectionToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchPlaceholder="Search executions…"
        resultLabel={resultLabel}
      />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-surface-variant/20 px-4 py-8 text-center font-manrope text-[13px] font-medium text-on-surface-variant">
          No executions match &quot;{searchQuery.trim()}&quot;
        </p>
      ) : (
        <div
          className={cn(
            isListView
              ? "flex flex-col gap-2"
              : "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {filtered.map((execution) => (
            <ExecutionCard
              key={execution.id}
              execution={execution}
              variant={isListView ? "compact" : "default"}
              onDeleted={removeExecution}
              onCancelled={cancelExecution}
              onRerun={refetchAll}
            />
          ))}
        </div>
      )}
    </>
  );
};

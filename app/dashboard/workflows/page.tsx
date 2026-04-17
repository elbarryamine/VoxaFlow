"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui";
import { WorkflowCard, type Workflow } from "@/src/features/workflows";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadWorkflows() {
      try {
        const response = await fetch("/api/workflows");
        const payload = (await response.json()) as {
          workflows?: Workflow[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to fetch workflows");
        }

        if (mounted) {
          setWorkflows(payload.workflows ?? []);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to fetch workflows",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkflows();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageLayout
      title="Workflows"
      description="Automate calls and post-call actions"
      actions={
        <Link
          href="/dashboard/workflows/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </Link>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading workflows...</p>
      ) : null}
      {errorMessage ? <p className="text-sm text-danger">{errorMessage}</p> : null}
      {!isLoading && !errorMessage ? (
        <div className="grid grid-cols-3 gap-5">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
          ))}
        </div>
      ) : null}
    </PageLayout>
  );
}

"use client";

import { useEffect, useState } from "react";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { WorkflowCard } from "@/src/features/workflows/ui/WorkflowCard";
import { StartWorkflowModal } from "@/src/features/workflows/ui/StartWorkflowModal";
import { CircleNotch, Plus } from "@phosphor-icons/react/dist/ssr";
import type { Workflow } from "@/src/features/workflows/types/Workflow.types";

export default function WorkflowsPage() {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  async function fetchWorkflows() {
    try {
      const res = await fetch("/api/workflows");
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
      }
    } catch (err) {
      console.error("Failed to fetch workflows:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageLayout
        title="Workflows"
        description="Automate AI-driven processes and integrations"
        actions={
          <button
            onClick={() => setIsStartModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <Plus className="h-4 w-4" />
            New Workflow
          </button>
        }
      >
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <CircleNotch className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : workflows.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <WorkflowCard key={wf.id} workflow={wf} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center p-8">
            <h3 className="text-lg font-semibold text-foreground">No workflows yet</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Create your first automation pipeline to start processing leads, sending emails, or triggering AI actions.
            </p>
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <Plus className="h-4 w-4" />
              Create First Workflow
            </button>
          </div>
        )}
      </PageLayout>

      <StartWorkflowModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
      />
    </>
  );
}

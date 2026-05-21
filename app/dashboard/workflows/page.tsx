"use client";

import { useEffect, useState } from "react";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
import { WorkflowsList } from "@/src/features/workflows/ui/WorkflowsList";
import { StartWorkflowModal } from "@/src/features/workflows/ui/StartWorkflowModal";
import { CircleNotch, GitBranch, Plus } from "@phosphor-icons/react/dist/ssr";
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

  const isEmpty = !loading && workflows.length === 0;

  return (
    <>
      <PageLayout
        title="Workflows"
        description="Automate AI-driven processes and integrations"
        contentClassName={
          isEmpty || loading ? "flex min-h-0 flex-1 flex-col" : undefined
        }
        actions={
          <TopBarButton onClick={() => setIsStartModalOpen(true)}>
            <Plus className="h-4 w-4" weight="bold" />
            New Workflow
          </TopBarButton>
        }
      >
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <CircleNotch className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isEmpty ? (
          <EmptyState
            layout="page"
            icon={GitBranch}
            title="No workflows yet"
            description="Create your first automation pipeline to process leads, send emails, or trigger AI actions."
            action={
              <TopBarButton onClick={() => setIsStartModalOpen(true)}>
                <Plus className="h-4 w-4" weight="bold" />
                Create first workflow
              </TopBarButton>
            }
          />
        ) : (
          <WorkflowsList workflows={workflows} />
        )}
      </PageLayout>

      <StartWorkflowModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
      />
    </>
  );
}

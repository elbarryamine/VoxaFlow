"use client";

import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { WorkflowCard } from "@/src/features/workflows/ui/WorkflowCard";
import { MOCK_WORKFLOWS } from "@/src/features/workflows/constants/MOCK_WORKFLOWS";
import { StartWorkflowModal } from "@/src/features/workflows/ui/StartWorkflowModal";

export default function WorkflowsPage() {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

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
        <div className="grid grid-cols-3 gap-5">
          {MOCK_WORKFLOWS.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
          ))}
        </div>
      </PageLayout>

      <StartWorkflowModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
      />
    </>
  );
}

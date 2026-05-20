"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
import { Play, FloppyDisk, CircleNotch } from "@phosphor-icons/react/dist/ssr";

import { WorkflowCanvas } from "@/src/features/workflows/ui/WorkflowCanvas";
import type { WorkflowDefinition } from "@/src/features/workflows/types/Workflow.types";

export default function NewWorkflowPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("Untitled Workflow");

  const handleSave = () => {
    window.dispatchEvent(new CustomEvent("save-workflow-trigger"));
  };

  const onActualSave = async (definition: WorkflowDefinition) => {
    setSaving(true);
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          definition,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/workflows/${data.id}`);
      } else {
        const errorData = await res.json();
        alert(`Failed to save: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Failed to save workflow:", err);
      alert("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      title={name}
      description="Build and configure your automation pipeline"
      backHref="/dashboard/workflows"
      onTitleChange={setName}
      actions={
        <>
          <TopBarButton variant="secondary" type="button">
            <Play className="h-4 w-4" />
            Test Run
          </TopBarButton>
          <TopBarButton onClick={handleSave} disabled={saving}>
            {saving ? <CircleNotch className="h-4 w-4 animate-spin" /> : <FloppyDisk className="h-4 w-4" />}
            Save
          </TopBarButton>
        </>
      }
      withContentPadding={false}
      contentClassName="min-h-0 overflow-hidden"
    >
      <WorkflowCanvas onSave={onActualSave} />
    </PageLayout>
  );
}

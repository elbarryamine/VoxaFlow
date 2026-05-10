"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import { Play, FloppyDisk, CircleNotch } from "@phosphor-icons/react/dist/ssr";

import { WorkflowCanvas } from "@/src/features/workflows/ui/WorkflowCanvas";

export default function NewWorkflowPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("Untitled Workflow");

  const handleSave = () => {
    window.dispatchEvent(new CustomEvent("save-workflow-trigger"));
  };

  const onActualSave = async (definition: any) => {
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
          <button className="flex items-center gap-2 rounded-md border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            <Play className="h-4 w-4" />
            Test Run
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <CircleNotch className="h-4 w-4 animate-spin" /> : <FloppyDisk className="h-4 w-4" />}
            Save
          </button>
        </>
      }
      withContentPadding={false}
      contentClassName="min-h-0 overflow-hidden"
    >
      <WorkflowCanvas onSave={onActualSave} />
    </PageLayout>
  );
}

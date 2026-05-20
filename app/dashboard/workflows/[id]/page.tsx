"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
import { Play, FloppyDisk, CircleNotch, CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";

import { WorkflowCanvas } from "@/src/features/workflows/ui/WorkflowCanvas";
import type { Workflow, WorkflowDefinition } from "@/src/features/workflows/types/Workflow.types";

export default function EditWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testing, setTesting] = useState(false);

  const handleTestRun = async () => {
    setTesting(true);
    try {
      const res = await fetch(`/api/workflows/${id}/test`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.executionIds && data.executionIds.length > 0) {
          router.push(`/dashboard/executions/${data.executionIds[0]}`);
        } else {
          alert("No test executions were started.");
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to trigger test run. Please configure a trigger with valid mock data first.");
      }
    } catch (err) {
      console.error("Failed to execute test run:", err);
      alert("An unexpected error occurred while starting the test run.");
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        const res = await fetch(`/api/workflows/${id}`);
        if (res.ok) {
          const data = await res.json();
          setWorkflow(data);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Fetch workflow failed:", res.status, errorData);
          router.push("/dashboard/workflows");
        }
      } catch (err) {
        console.error("Failed to fetch workflow exception:", err);
        router.push("/dashboard/workflows");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchWorkflow();
    }
  }, [id, router]);

  const handleSave = () => {
    // Dispatch custom event that WorkflowCanvas will listen to
    window.dispatchEvent(new CustomEvent("save-workflow-trigger"));
  };

  const onActualSave = async (definition: WorkflowDefinition) => {
    if (!workflow) return;
    setSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch(`/api/workflows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: workflow.name,
          definition 
        }),
      });
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        const errorData = await res.json();
        console.error("Save failed:", errorData);
      }
    } catch (err) {
      console.error("Failed to save workflow:", err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (newName: string) => {
    if (!workflow) return;
    setWorkflow({ ...workflow, name: newName });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircleNotch className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workflow) return null;

  return (
    <PageLayout
      title={workflow.name}
      description={workflow.description || "Build and configure your workflow"}
      backHref="/dashboard/workflows"
      onTitleChange={handleTitleChange}
      actions={
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <CheckCircle weight="fill" className="h-4 w-4" />
              Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1 text-xs font-medium text-destructive">
              <XCircle weight="fill" className="h-4 w-4" />
              Failed to save
            </span>
          )}
          
          <TopBarButton
            variant="secondary"
            onClick={handleTestRun}
            disabled={testing || saving}
          >
            {testing ? <CircleNotch className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Test Run
          </TopBarButton>
          <TopBarButton onClick={handleSave} disabled={saving}>
            {saving ? <CircleNotch className="h-4 w-4 animate-spin" /> : <FloppyDisk className="h-4 w-4" />}
            Save
          </TopBarButton>
        </div>
      }
      withContentPadding={false}
      contentClassName="min-h-0 overflow-hidden"
    >
      <WorkflowCanvas initialWorkflow={workflow} onSave={onActualSave} />
    </PageLayout>
  );
}

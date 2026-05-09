import { PageLayout } from "@/src/shared/ui/PageLayout";
import { Play, FloppyDisk } from "@phosphor-icons/react/dist/ssr";

import { WorkflowCanvas } from "@/src/features/workflows/ui/WorkflowCanvas";

export default function NewWorkflowPage() {
  return (
    <PageLayout
      title="Lead Qualification Pipeline"
      description="Build and configure your workflow"
      backHref="/dashboard/workflows"
      actions={
        <>
          <button className="flex items-center gap-2 rounded-md border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            <Play className="h-4 w-4" />
            Test Run
          </button>
          <button className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <FloppyDisk className="h-4 w-4" />
            Save
          </button>
        </>
      }
      withContentPadding={false}
      contentClassName="min-h-0 overflow-hidden"
    >
      <WorkflowCanvas />
    </PageLayout>
  );
}

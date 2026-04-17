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
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
            <Play className="h-3.5 w-3.5" />
            Test Run
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80">
            <FloppyDisk className="h-3.5 w-3.5" />
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

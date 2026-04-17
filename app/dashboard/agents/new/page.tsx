import { PageLayout } from "@/src/shared/ui";
import { AgentForm } from "@/src/features/agents";

export default function NewAgentPage() {
  return (
    <PageLayout
      title="New Agent"
      description="Configure a new AI voice agent"
      backHref="/dashboard/agents"
      withContentPadding={false}
    >
      <AgentForm />
    </PageLayout>
  );
}

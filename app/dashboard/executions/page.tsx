"use client";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { ExecutionCard } from "@/src/features/executions/ui/ExecutionCard";
import { MOCK_EXECUTIONS } from "@/src/features/executions/constants/MOCK_EXECUTIONS";

export default function ExecutionsPage() {
  return (
    <PageLayout
      title="Executions"
      description="Monitor and manage your workflow execution history"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_EXECUTIONS.map((execution) => (
          <ExecutionCard key={execution.id} execution={execution} />
        ))}
      </div>
    </PageLayout>
  );
}

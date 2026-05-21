import Link from "next/link";
import { GitBranch, Pulse } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";
import { DashboardKpiSection } from "@/src/features/dashboard/ui/DashboardKpiSection";
import { DashboardUsageSection } from "@/src/features/dashboard/ui/DashboardUsageSection";
import { ExecutionCard } from "@/src/features/executions/ui/ExecutionCard";
import { WorkflowCard } from "@/src/features/workflows/ui/WorkflowCard";
import type { DashboardData } from "@/src/features/dashboard/utils/loadDashboardData";

type DashboardOverviewProps = DashboardData;

export const DashboardOverview = ({
  executions,
  workflows,
  metrics,
  usage,
}: DashboardOverviewProps) => {
  const recentExecutions = executions.slice(0, 4);
  const recentWorkflows = workflows.slice(0, 4);

  return (
    <PageLayout
      title="Dashboard"
      description="Overview of your workflow automations"
      contentClassName="space-y-8"
    >
      <DashboardUsageSection usage={usage} />
      <DashboardKpiSection metrics={metrics} />

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-newsreader text-xl font-bold text-on-surface">
            Your Workflows
          </h2>
          <Link
            href="/dashboard/workflows"
            className="font-manrope text-[14px] font-bold text-primary transition-colors hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        {recentWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {recentWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                variant="compact"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            layout="section"
            icon={GitBranch}
            title="No workflows yet"
            description="Create your first workflow to start automating."
            action={
              <TopBarLink href="/dashboard/workflows">Create a workflow</TopBarLink>
            }
          />
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-newsreader text-xl font-bold text-on-surface">
            Recent Executions
          </h2>
          <Link
            href="/dashboard/executions"
            className="font-manrope text-[14px] font-bold text-primary transition-colors hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        {recentExecutions.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {recentExecutions.map((execution) => (
              <ExecutionCard
                key={execution.id}
                execution={execution}
                variant="compact"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            layout="section"
            icon={Pulse}
            title="No executions yet"
            description="Run a workflow to see execution history here."
            action={
              <TopBarLink href="/dashboard/workflows">Go to workflows</TopBarLink>
            }
          />
        )}
      </section>

      
    </PageLayout>
  );
};

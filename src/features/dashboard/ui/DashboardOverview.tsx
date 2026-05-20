import Link from "next/link";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { DashboardKpiSection } from "@/src/features/dashboard/ui/DashboardKpiSection";
import { RecentActivity } from "@/src/features/dashboard/ui/RecentActivity";
import { ExecutionCard } from "@/src/features/executions/ui/ExecutionCard";
import { WorkflowCard } from "@/src/features/workflows/ui/WorkflowCard";
import type { DashboardData } from "@/src/features/dashboard/utils/loadDashboardData";

type DashboardOverviewProps = DashboardData;

export const DashboardOverview = ({
  executions,
  workflows,
  activities,
  metrics,
}: DashboardOverviewProps) => {
  const recentExecutions = executions.slice(0, 3);
  const recentWorkflows = workflows.slice(0, 3);

  return (
    <PageLayout
      title="Dashboard"
      description="Overview of your workflow automations"
      contentClassName="space-y-10"
    >
      <DashboardKpiSection metrics={metrics} />

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-newsreader text-2xl font-bold text-on-surface">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentExecutions.map((execution) => (
              <ExecutionCard key={execution.id} execution={execution} />
            ))}
          </div>
        ) : (
          <EmptyPanel
            title="No executions yet"
            description="Run a workflow to see execution history here."
            href="/dashboard/workflows"
            linkLabel="Go to workflows"
          />
        )}
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-newsreader text-2xl font-bold text-on-surface">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        ) : (
          <EmptyPanel
            title="No workflows yet"
            description="Create your first workflow to start automating."
            href="/dashboard/workflows"
            linkLabel="Create a workflow"
          />
        )}
      </section>

      <RecentActivity activities={activities} />
    </PageLayout>
  );
};

interface EmptyPanelProps {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

const EmptyPanel = ({ title, description, href, linkLabel }: EmptyPanelProps) => (
  <div className="rounded-2xl border border-dashed border-border/50 bg-surface-container-lowest px-6 py-10 text-center">
    <h3 className="font-newsreader text-lg font-bold text-on-surface">{title}</h3>
    <p className="mt-2 font-manrope text-[14px] font-medium text-on-surface-variant">
      {description}
    </p>
    <Link
      href={href}
      className="mt-5 inline-flex font-manrope text-[14px] font-bold text-primary hover:text-primary/80"
    >
      {linkLabel}
    </Link>
  </div>
);

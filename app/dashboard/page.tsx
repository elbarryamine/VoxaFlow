"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Pulse, GitBranch, TrendUp } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { StatCard } from "@/src/shared/ui/StatCard";
import { RecentActivity } from "@/src/features/dashboard/ui/RecentActivity";
import { ExecutionCard } from "@/src/features/executions/ui/ExecutionCard";
import { MOCK_EXECUTIONS } from "@/src/features/executions/constants/MOCK_EXECUTIONS";
import { WorkflowCard } from "@/src/features/workflows/ui/WorkflowCard";
import { MOCK_WORKFLOWS } from "@/src/features/workflows/constants/MOCK_WORKFLOWS";

export default function DashboardPage() {
  const executions = MOCK_EXECUTIONS;
  const workflows = MOCK_WORKFLOWS;

  const successRate = useMemo(() => {
    const successful = executions.filter((e) => e.status === "success").length;
    if (!executions.length) return "0%";
    return `${Math.round((successful / executions.length) * 100)}%`;
  }, [executions]);

  return (
    <PageLayout
      title="Dashboard"
      description="Overview of your workflow automations"
      contentClassName="space-y-8"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Executions"
          value={String(executions.length)}
          change="Live"
          changeType="neutral"
          icon={Pulse}
        />
        <StatCard
          label="Active Workflows"
          value={
            String(workflows.filter((workflow) => workflow.is_active).length)
          }
          change="Live"
          changeType="neutral"
          icon={GitBranch}
        />
        <StatCard
          label="Success Rate"
          value={successRate}
          change="Live"
          changeType="neutral"
          icon={TrendUp}
        />
      </div>

      {/* Executions preview */}
      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Recent Executions</h2>
          <Link
            href="/dashboard/executions"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {executions.slice(0, 3).map((execution) => (
            <ExecutionCard key={execution.id} execution={execution} />
          ))}
        </div>
      </section>

      {/* Workflows preview */}
      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Your Workflows</h2>
          <Link
            href="/dashboard/workflows"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
          ))}
        </div>
      </section>

      {/* Activity */}
      <RecentActivity />
    </PageLayout>
  );
}

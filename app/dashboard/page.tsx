"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Robot, GitBranch, Phone, TrendUp } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { StatCard } from "@/src/shared/ui/StatCard";
import { RecentActivity } from "@/src/features/dashboard/ui/RecentActivity";
import { AgentCard } from "@/src/features/agents/ui/AgentCard";
import { MOCK_AGENTS } from "@/src/features/agents/constants/MOCK_AGENTS";
import { WorkflowCard } from "@/src/features/workflows/ui/WorkflowCard";
import { MOCK_WORKFLOWS } from "@/src/features/workflows/constants/MOCK_WORKFLOWS";

export default function DashboardPage() {
  const agents = MOCK_AGENTS;
  const workflows = MOCK_WORKFLOWS;
  const callsCount = 12;

  const successRate = useMemo(() => {
    if (!callsCount) {
      return "0%";
    }
    return "100%";
  }, [callsCount]);

  return (
    <PageLayout
      title="Dashboard"
      description="Overview of your voice agents"
      contentClassName="space-y-8"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Agents"
          value={String(agents.length)}
          change="Live"
          changeType="neutral"
          icon={Robot}
        />
        <StatCard
          label="Active Workflows"
          value={
            String(workflows.filter((workflow) => workflow.status === "active").length)
          }
          change="Live"
          changeType="neutral"
          icon={GitBranch}
        />
        <StatCard
          label="Calls Today"
          value={String(callsCount)}
          change="Live"
          changeType="neutral"
          icon={Phone}
        />
        <StatCard
          label="Success Rate"
          value={successRate}
          change="Live"
          changeType="neutral"
          icon={TrendUp}
        />
      </div>

      {/* Agents preview */}
      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Your Agents</h2>
          <Link
            href="/dashboard/agents"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {agents.slice(0, 3).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
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
      <RecentActivity callsCount={callsCount} />
    </PageLayout>
  );
}

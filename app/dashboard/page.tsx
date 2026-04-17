"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Robot, GitBranch, Phone, TrendUp } from "@phosphor-icons/react/dist/ssr";

import { PageLayout, StatCard } from "@/src/shared/ui";
import { RecentActivity } from "@/src/features/dashboard";
import { AgentCard, type Agent } from "@/src/features/agents";
import { WorkflowCard, type Workflow } from "@/src/features/workflows";

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [callsCount, setCallsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [agentsResponse, workflowsResponse, callsResponse] = await Promise.all([
          fetch("/api/agents"),
          fetch("/api/workflows"),
          fetch("/api/calls"),
        ]);

        const agentsPayload = (await agentsResponse.json()) as { agents?: Agent[] };
        const workflowsPayload = (await workflowsResponse.json()) as {
          workflows?: Workflow[];
        };
        const callsPayload = (await callsResponse.json()) as { calls?: Array<{ id: string }> };

        if (!mounted) {
          return;
        }

        setAgents(agentsPayload.agents ?? []);
        setWorkflows(workflowsPayload.workflows ?? []);
        setCallsCount(callsPayload.calls?.length ?? 0);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();
    return () => {
      mounted = false;
    };
  }, []);

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
          value={isLoading ? "..." : String(agents.length)}
          change="Live"
          changeType="neutral"
          icon={Robot}
        />
        <StatCard
          label="Active Workflows"
          value={
            isLoading
              ? "..."
              : String(workflows.filter((workflow) => workflow.status === "active").length)
          }
          change="Live"
          changeType="neutral"
          icon={GitBranch}
        />
        <StatCard
          label="Calls Today"
          value={isLoading ? "..." : String(callsCount)}
          change="Live"
          changeType="neutral"
          icon={Phone}
        />
        <StatCard
          label="Success Rate"
          value={isLoading ? "..." : successRate}
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

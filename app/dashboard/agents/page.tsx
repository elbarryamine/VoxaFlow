"use client";

import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { AgentCard } from "@/src/features/agents/ui/AgentCard";
import { MOCK_AGENTS } from "@/src/features/agents/constants/MOCK_AGENTS";

export default function AgentsPage() {
  return (
    <PageLayout
      title="Agents"
      description="Create and manage your AI voice agents"
      actions={
        <Link
          href="/dashboard/agents/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" />
          New Agent
        </Link>
      }
    >
      <div className="grid grid-cols-3 gap-5">
        {MOCK_AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </PageLayout>
  );
}

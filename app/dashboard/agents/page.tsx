"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui";
import { AgentCard, type Agent } from "@/src/features/agents";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAgents() {
      try {
        const response = await fetch("/api/agents");
        const payload = (await response.json()) as {
          agents?: Agent[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load agents");
        }

        if (isMounted) {
          setAgents(payload.agents ?? []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load agents");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAgents();
    return () => {
      isMounted = false;
    };
  }, []);

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
      {isLoading ? <p className="text-sm text-muted-foreground">Loading agents...</p> : null}
      {errorMessage ? <p className="text-sm text-danger">{errorMessage}</p> : null}
      {!isLoading && !errorMessage ? (
        <div className="grid grid-cols-3 gap-5">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : null}
    </PageLayout>
  );
}

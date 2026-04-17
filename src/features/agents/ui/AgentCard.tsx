"use client";

import Link from "next/link";
import {
  Phone,
  Clock,
  TrendUp,
  DotsThreeVertical,
} from "@phosphor-icons/react/dist/ssr";
import type { Agent } from "../types/Agent.types";

interface AgentCardProps {
  agent: Agent;
}

const STATUS_STYLES = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted/10 text-muted-foreground",
  draft: "bg-warning/10 text-warning",
} as const;

export const AgentCard = ({ agent }: AgentCardProps) => {
  return (
    <Link
      href={`/dashboard/agents/${agent.id}`}
      className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-primary">
            {agent.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary">
              {agent.name}
            </h3>
            <span
              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[agent.status]}`}
            >
              {agent.status}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="rounded-lg p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-secondary-foreground group-hover:opacity-100"
        >
          <DotsThreeVertical className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {agent.description}
      </p>

      <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          <span>{agent.callsHandled.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{agent.avgDuration}</span>
        </div>
        {agent.successRate > 0 && (
          <div className="flex items-center gap-1.5">
            <TrendUp className="h-3.5 w-3.5" />
            <span>{agent.successRate}%</span>
          </div>
        )}
      </div>
    </Link>
  );
};

"use client";

import { useState } from "react";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import { MOCK_AGENTS } from "@/src/features/agents/constants/MOCK_AGENTS";

interface CallItem {
  id: string;
  toNumber: string;
  fromNumber: string;
  status: string;
  createdAt: string;
  externalCallId: string | null;
}

interface AgentOption {
  id: string;
  name: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallItem[]>([
    {
      id: "call-1",
      toNumber: "+15555550123",
      fromNumber: "+14155550101",
      status: "completed",
      createdAt: new Date(Date.now() - 3_600_000).toISOString(),
      externalCallId: null,
    },
    {
      id: "call-2",
      toNumber: "+15555550124",
      fromNumber: "+14155550101",
      status: "in_progress",
      createdAt: new Date(Date.now() - 900_000).toISOString(),
      externalCallId: null,
    },
  ]);
  const agents: AgentOption[] = MOCK_AGENTS.map((agent) => ({ id: agent.id, name: agent.name }));
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id ?? "");
  const [toNumber, setToNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStartCall = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!selectedAgentId || !toNumber.trim()) {
        throw new Error("Select an agent and enter a destination number");
      }

      setCalls((prev) => [
        {
          id: `call-${Date.now()}`,
          toNumber,
          fromNumber: "+14155550101",
          status: "queued",
          createdAt: new Date().toISOString(),
          externalCallId: null,
        },
        ...prev,
      ]);
      setSuccessMessage("Demo mode: call added to mock history.");
      setToNumber("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to start call");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Calls" description="Start outbound calls and review call history">
      <section className="mb-6 rounded-xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Start a call</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={selectedAgentId}
            onChange={(event) => setSelectedAgentId(event.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={toNumber}
            onChange={(event) => setToNumber(event.target.value)}
            placeholder="+15555550123"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleStartCall}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Calling..." : "Call"}
          </button>
        </div>
        {errorMessage ? <p className="mt-3 text-sm text-danger">{errorMessage}</p> : null}
        {successMessage ? <p className="mt-3 text-sm text-success">{successMessage}</p> : null}
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h3 className="font-semibold">Call history</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">To</th>
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Started</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr key={call.id} className="border-b border-border/60">
                  <td className="px-5 py-3">{call.toNumber}</td>
                  <td className="px-5 py-3">{call.fromNumber}</td>
                  <td className="px-5 py-3 capitalize">{call.status.replaceAll("_", " ")}</td>
                  <td className="px-5 py-3">
                    {new Date(call.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageLayout>
  );
}

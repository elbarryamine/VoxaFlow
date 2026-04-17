"use client";

import { MOCK_AGENTS } from "@/src/features/agents/constants/MOCK_AGENTS";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

export const OutboundCallConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const agentOptions = MOCK_AGENTS.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="outbound-agent">Agent</FieldLabel>
        <SelectInput
          id="outbound-agent"
          value={String(data.agentId ?? "")}
          onChange={(value) => {
            const selected = MOCK_AGENTS.find((agent) => agent.id === value);
            onUpdate("agentId", value);
            onUpdate("agentName", selected?.name ?? "");
          }}
          options={agentOptions}
          placeholder="Select agent"
        />
      </div>

      <div>
        <FieldLabel htmlFor="caller-id">Caller ID Number</FieldLabel>
        <TextInput
          id="caller-id"
          value={String(data.callerId ?? "")}
          onChange={(value) => onUpdate("callerId", value)}
          placeholder="+1 (555) 111-0000"
        />
      </div>
    </div>
  );
};

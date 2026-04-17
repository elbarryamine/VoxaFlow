"use client";

import { MOCK_AGENTS } from "@/src/features/agents/constants/MOCK_AGENTS";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

export const InboundCallConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const agentOptions = MOCK_AGENTS.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="inbound-agent">Agent</FieldLabel>
        <SelectInput
          id="inbound-agent"
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
        <FieldLabel htmlFor="inbound-number">Inbound Phone Number</FieldLabel>
        <TextInput
          id="inbound-number"
          value={String(data.phoneNumber ?? "")}
          onChange={(value) => onUpdate("phoneNumber", value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>
    </div>
  );
};

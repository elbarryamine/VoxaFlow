"use client";

import { MOCK_AGENTS } from "@/src/features/agents/constants/MOCK_AGENTS";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

const DEFAULT_PATH = "https://api.voiceflow.app/hooks/workflow/custom-trigger";

export const CustomWebhookTriggerConfig = ({
  data,
  onUpdate,
}: NodeConfigProps) => {
  const agentOptions = MOCK_AGENTS.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  const webhookPath = String(data.webhookPath ?? DEFAULT_PATH);

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="custom-webhook-agent">Agent</FieldLabel>
        <SelectInput
          id="custom-webhook-agent"
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
        <FieldLabel htmlFor="webhook-path">Webhook URL (POST)</FieldLabel>
        <TextInput
          id="webhook-path"
          value={webhookPath}
          onChange={(value) => onUpdate("webhookPath", value)}
          placeholder={DEFAULT_PATH}
        />
      </div>
    </div>
  );
};

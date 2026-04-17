"use client";

import { MOCK_AGENTS } from "@/src/features/agents";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

const YOUCAN_EVENTS = [
  { value: "order_created", label: "Order Created" },
  { value: "order_paid", label: "Order Paid" },
  { value: "cart_abandoned", label: "Cart Abandoned" },
];

export const YoucanTriggerConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const agentOptions = MOCK_AGENTS.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="youcan-agent">Agent</FieldLabel>
        <SelectInput
          id="youcan-agent"
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
        <FieldLabel htmlFor="youcan-event">YouCan Event</FieldLabel>
        <SelectInput
          id="youcan-event"
          value={String(data.webhookEvent ?? "order_created")}
          onChange={(value) => onUpdate("webhookEvent", value)}
          options={YOUCAN_EVENTS}
        />
      </div>

      <div>
        <FieldLabel htmlFor="youcan-store">Store Name</FieldLabel>
        <TextInput
          id="youcan-store"
          value={String(data.storeDomain ?? "")}
          onChange={(value) => onUpdate("storeDomain", value)}
          placeholder="youcan-store-name"
        />
      </div>
    </div>
  );
};

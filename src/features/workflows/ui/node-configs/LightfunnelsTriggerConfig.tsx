"use client";

import { MOCK_AGENTS } from "@/src/features/agents";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

const LIGHTFUNNELS_EVENTS = [
  { value: "order_created", label: "Order Created" },
  { value: "checkout_started", label: "Checkout Started" },
  { value: "abandoned_checkout", label: "Abandoned Checkout" },
];

export const LightfunnelsTriggerConfig = ({
  data,
  onUpdate,
}: NodeConfigProps) => {
  const agentOptions = MOCK_AGENTS.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="lf-agent">Agent</FieldLabel>
        <SelectInput
          id="lf-agent"
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
        <FieldLabel htmlFor="lf-event">Lightfunnels Event</FieldLabel>
        <SelectInput
          id="lf-event"
          value={String(data.webhookEvent ?? "order_created")}
          onChange={(value) => onUpdate("webhookEvent", value)}
          options={LIGHTFUNNELS_EVENTS}
        />
      </div>

      <div>
        <FieldLabel htmlFor="lf-store">Store Name</FieldLabel>
        <TextInput
          id="lf-store"
          value={String(data.storeDomain ?? "")}
          onChange={(value) => onUpdate("storeDomain", value)}
          placeholder="your-lightfunnels-store"
        />
      </div>
    </div>
  );
};

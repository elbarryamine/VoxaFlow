"use client";

import { MOCK_AGENTS } from "@/src/features/agents";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

const SHOPIFY_EVENTS = [
  { value: "orders/create", label: "Order Created" },
  { value: "orders/paid", label: "Order Paid" },
  { value: "carts/update", label: "Cart Updated" },
];

export const ShopifyTriggerConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const agentOptions = MOCK_AGENTS.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="shopify-agent">Agent</FieldLabel>
        <SelectInput
          id="shopify-agent"
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
        <FieldLabel htmlFor="shopify-event">Shopify Event</FieldLabel>
        <SelectInput
          id="shopify-event"
          value={String(data.webhookEvent ?? "orders/create")}
          onChange={(value) => onUpdate("webhookEvent", value)}
          options={SHOPIFY_EVENTS}
        />
      </div>

      <div>
        <FieldLabel htmlFor="shopify-store">Store Domain</FieldLabel>
        <TextInput
          id="shopify-store"
          value={String(data.storeDomain ?? "")}
          onChange={(value) => onUpdate("storeDomain", value)}
          placeholder="my-store.myshopify.com"
        />
      </div>
    </div>
  );
};

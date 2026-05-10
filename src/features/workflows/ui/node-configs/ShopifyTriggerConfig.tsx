"use client";

import { MOCK_EXECUTIONS } from "@/src/features/executions/constants/MOCK_EXECUTIONS";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

const SHOPIFY_EVENTS = [
  { value: "orders/create", label: "Order Created" },
  { value: "orders/paid", label: "Order Paid" },
  { value: "carts/update", label: "Cart Updated" },
];

export const ShopifyTriggerConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const profileOptions = MOCK_EXECUTIONS.map((exec) => ({
    value: exec.id,
    label: exec.workflowName,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="shopify-profile">Workflow Profile</FieldLabel>
        <SelectInput
          id="shopify-profile"
          value={String(data.profileId ?? "")}
          onChange={(value) => {
            const selected = MOCK_EXECUTIONS.find((exec) => exec.id === value);
            onUpdate("profileId", value);
            onUpdate("profileName", selected?.workflowName ?? "");
          }}
          options={profileOptions}
          placeholder="Select profile"
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

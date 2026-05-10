"use client";

import { MOCK_EXECUTIONS } from "@/src/features/executions/constants/MOCK_EXECUTIONS";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

const YOUCAN_EVENTS = [
  { value: "order_created", label: "Order Created" },
  { value: "order_paid", label: "Order Paid" },
  { value: "cart_abandoned", label: "Cart Abandoned" },
];

export const YoucanTriggerConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const profileOptions = MOCK_EXECUTIONS.map((exec) => ({
    value: exec.id,
    label: exec.workflowName,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="youcan-profile">Workflow Profile</FieldLabel>
        <SelectInput
          id="youcan-profile"
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

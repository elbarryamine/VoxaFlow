"use client";

import { MOCK_EXECUTIONS } from "@/src/features/executions/constants/MOCK_EXECUTIONS";

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
  const profileOptions = MOCK_EXECUTIONS.map((exec) => ({
    value: exec.id,
    label: exec.workflowName,
  }));

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="lf-profile">Workflow Profile</FieldLabel>
        <SelectInput
          id="lf-profile"
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

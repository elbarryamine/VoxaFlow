"use client";

import { MOCK_EXECUTIONS } from "@/src/features/executions/constants/MOCK_EXECUTIONS";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput } from "./shared";

const DEFAULT_PATH = "https://api.workflowflow.app/hooks/workflow/custom-trigger";

export const CustomWebhookTriggerConfig = ({
  data,
  onUpdate,
}: NodeConfigProps) => {
  const profileOptions = MOCK_EXECUTIONS.map((exec) => ({
    value: exec.id,
    label: exec.workflowName,
  }));

  const webhookPath = String(data.webhookPath ?? DEFAULT_PATH);

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="custom-webhook-profile">Workflow Profile</FieldLabel>
        <SelectInput
          id="custom-webhook-profile"
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

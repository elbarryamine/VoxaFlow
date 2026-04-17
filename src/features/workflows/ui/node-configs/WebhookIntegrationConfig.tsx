"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextAreaInput, TextInput, SectionDivider } from "./shared";
import { ConnectionPicker } from "@/src/features/connections";

const METHOD_OPTIONS = [
  { value: "POST", label: "POST" },
  { value: "GET", label: "GET" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
];

export const WebhookIntegrationConfig = ({
  data,
  onUpdate,
}: NodeConfigProps) => {
  return (
    <div className="space-y-4">
      <ConnectionPicker
        connectionType="webhook"
        value={data.connectionId as string | undefined}
        onChange={(id) => onUpdate("connectionId", id)}
      />

      <SectionDivider label="Request Settings" />

      <div>
        <FieldLabel htmlFor="integration-method">Method</FieldLabel>
        <SelectInput
          id="integration-method"
          value={String(data.method ?? "POST")}
          onChange={(value) => onUpdate("method", value)}
          options={METHOD_OPTIONS}
        />
      </div>

      <div>
        <FieldLabel htmlFor="integration-url">URL</FieldLabel>
        <TextInput
          id="integration-url"
          value={String(data.url ?? "")}
          onChange={(value) => onUpdate("url", value)}
          placeholder="https://api.example.com/events"
        />
      </div>

      <div>
        <FieldLabel htmlFor="integration-body">Request Body</FieldLabel>
        <TextAreaInput
          id="integration-body"
          value={String(data.bodyTemplate ?? "")}
          onChange={(value) => onUpdate("bodyTemplate", value)}
          placeholder='{"leadId":"{{lead.id}}"}'
          rows={4}
        />
      </div>
    </div>
  );
};

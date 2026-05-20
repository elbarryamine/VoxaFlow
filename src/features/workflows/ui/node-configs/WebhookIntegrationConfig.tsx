"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextInput, SectionDivider, CredentialPicker, AutocompleteTextArea } from "./shared";

const METHOD_OPTIONS = [
  { value: "POST", label: "POST" },
  { value: "GET", label: "GET" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
];

export const WebhookIntegrationConfig = ({
  data,
  onUpdate,
  inputVariables,
}: NodeConfigProps) => {
  const autocompleteOptions = inputVariables
    ? inputVariables.flatMap((group) =>
        group.fields.map((field) => ({
          value: `${group.nodeId}.${field.name}`,
          label: `${group.nodeLabel}: ${field.name}`,
          type: field.type,
          description: field.description,
        }))
      )
    : [];
  return (
    <div className="space-y-4">
      <CredentialPicker
        service="http"
        value={data.credentialId as string | undefined}
        onChange={(id) => onUpdate("credentialId", id)}
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
        <AutocompleteTextArea
          id="integration-body"
          value={String(data.bodyTemplate ?? "")}
          onChange={(value) => onUpdate("bodyTemplate", value)}
          options={autocompleteOptions}
          placeholder='{"leadId":"{{lead.id}}"}'
          rows={4}
        />
      </div>
    </div>
  );
};

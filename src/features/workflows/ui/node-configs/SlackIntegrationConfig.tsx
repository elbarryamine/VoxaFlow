"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, TextInput, SectionDivider, AutocompleteTextArea, CredentialPicker } from "./shared";

export const SlackIntegrationConfig = ({ data, onUpdate, inputVariables }: NodeConfigProps) => {
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
        service="slack"
        value={data.credentialId as string | undefined}
        onChange={(id) => onUpdate("credentialId", id)}
      />

      <SectionDivider label="Message Settings" />

      <div>
        <FieldLabel htmlFor="slack-channel">Slack Channel</FieldLabel>
        <TextInput
          id="slack-channel"
          value={String(data.slackChannel ?? "")}
          onChange={(value) => onUpdate("slackChannel", value)}
          placeholder="#sales-alerts"
        />
      </div>

      <div>
        <FieldLabel htmlFor="slack-message">Message Template</FieldLabel>
        <AutocompleteTextArea
          id="slack-message"
          value={String(data.messageTemplate ?? "")}
          onChange={(value) => onUpdate("messageTemplate", value)}
          options={autocompleteOptions}
          placeholder="New qualified lead: {{customer.name}}"
          rows={3}
        />
      </div>
    </div>
  );
};

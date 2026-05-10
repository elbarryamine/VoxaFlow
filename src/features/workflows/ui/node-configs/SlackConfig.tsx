"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, TextInput, SectionDivider, AutocompleteTextArea, CredentialPicker } from "./shared";


export const SlackConfig = ({ data, onUpdate, inputVariables }: NodeConfigProps) => {
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
        <FieldLabel htmlFor="slack-channel">Channel</FieldLabel>
        <TextInput
          id="slack-channel"
          value={String(data.channel ?? "")}
          onChange={(v) => onUpdate("channel", v)}
          placeholder="#general or C012AB3CD"
        />
      </div>

      <div>
        <FieldLabel htmlFor="slack-text">Message Text</FieldLabel>
        <AutocompleteTextArea
          id="slack-text"
          value={String(data.text ?? "")}
          onChange={(v) => onUpdate("text", v)}
          options={autocompleteOptions}
          placeholder="New order from {{trigger.body.customer_name}} — ${{trigger.body.total}}"
          rows={4}
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Type <code className="rounded bg-muted px-1 font-mono text-[10px]">{"{{"}  </code> to insert variables from upstream nodes.
        </p>
      </div>

      <SectionDivider label="Appearance (optional)" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="slack-username">Bot Username</FieldLabel>
          <TextInput
            id="slack-username"
            value={String(data.username ?? "")}
            onChange={(v) => onUpdate("username", v)}
            placeholder="WorkflowBot"
          />
        </div>
        <div>
          <FieldLabel htmlFor="slack-emoji">Icon Emoji</FieldLabel>
          <TextInput
            id="slack-emoji"
            value={String(data.iconEmoji ?? "")}
            onChange={(v) => onUpdate("iconEmoji", v)}
            placeholder=":robot_face:"
          />
        </div>
      </div>
    </div>
  );
};

"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, TextAreaInput, TextInput, SectionDivider } from "./shared";
import { ConnectionPicker } from "@/src/features/connections/ui/ConnectionPicker";

export const SlackIntegrationConfig = ({ data, onUpdate }: NodeConfigProps) => {
  return (
    <div className="space-y-4">
      <ConnectionPicker
        connectionType="slack"
        value={data.connectionId as string | undefined}
        onChange={(id) => onUpdate("connectionId", id)}
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
        <TextAreaInput
          id="slack-message"
          value={String(data.messageTemplate ?? "")}
          onChange={(value) => onUpdate("messageTemplate", value)}
          placeholder="New qualified lead: {{customer.name}}"
          rows={3}
        />
      </div>
    </div>
  );
};

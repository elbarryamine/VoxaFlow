"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, TextAreaInput, TextInput, SectionDivider } from "./shared";
import { ConnectionPicker } from "@/src/features/connections";

export const EmailIntegrationConfig = ({ data, onUpdate }: NodeConfigProps) => {
  return (
    <div className="space-y-4">
      <ConnectionPicker
        connectionType="email"
        value={data.connectionId as string | undefined}
        onChange={(id) => onUpdate("connectionId", id)}
      />

      <SectionDivider label="Email Settings" />

      <div>
        <FieldLabel htmlFor="email-to">To</FieldLabel>
        <TextInput
          id="email-to"
          value={String(data.emailTo ?? "")}
          onChange={(value) => onUpdate("emailTo", value)}
          placeholder="ops@company.com"
        />
      </div>

      <div>
        <FieldLabel htmlFor="email-subject">Subject</FieldLabel>
        <TextInput
          id="email-subject"
          value={String(data.emailSubject ?? "")}
          onChange={(value) => onUpdate("emailSubject", value)}
          placeholder="New lead call summary"
        />
      </div>

      <div>
        <FieldLabel htmlFor="email-body">Body Template</FieldLabel>
        <TextAreaInput
          id="email-body"
          value={String(data.emailBody ?? "")}
          onChange={(value) => onUpdate("emailBody", value)}
          placeholder="Lead: {{customer.name}}"
          rows={4}
        />
      </div>
    </div>
  );
};

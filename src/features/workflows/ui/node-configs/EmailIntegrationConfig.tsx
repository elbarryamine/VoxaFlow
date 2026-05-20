"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SectionDivider, CredentialPicker, AutocompleteTextArea } from "./shared";

export const EmailIntegrationConfig = ({ data, onUpdate, inputVariables }: NodeConfigProps) => {
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
        service="resend"
        value={data.credentialId as string | undefined}
        onChange={(id) => onUpdate("credentialId", id)}
      />

      <SectionDivider label="Email Settings" />

      <div>
        <FieldLabel htmlFor="email-to">To</FieldLabel>
        <AutocompleteTextArea
          id="email-to"
          value={String(data.emailTo ?? "")}
          onChange={(value) => onUpdate("emailTo", value)}
          options={autocompleteOptions}
          placeholder="ops@company.com"
          rows={1}
        />
      </div>

      <div>
        <FieldLabel htmlFor="email-subject">Subject</FieldLabel>
        <AutocompleteTextArea
          id="email-subject"
          value={String(data.emailSubject ?? "")}
          onChange={(value) => onUpdate("emailSubject", value)}
          options={autocompleteOptions}
          placeholder="New lead notification"
          rows={1}
        />
      </div>

      <div>
        <FieldLabel htmlFor="email-body">Body Template</FieldLabel>
        <AutocompleteTextArea
          id="email-body"
          value={String(data.emailBody ?? "")}
          onChange={(value) => onUpdate("emailBody", value)}
          options={autocompleteOptions}
          placeholder="Lead: {{customer.name}}"
          rows={4}
        />
      </div>
    </div>
  );
};

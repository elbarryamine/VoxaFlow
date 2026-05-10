"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, TextInput, SectionDivider, AutocompleteTextArea, CredentialPicker } from "./shared";


export const SendEmailConfig = ({ data, onUpdate, inputVariables }: NodeConfigProps) => {
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

      <SectionDivider label="Recipients" />

      <div>
        <FieldLabel htmlFor="email-from">From Address</FieldLabel>
        <TextInput
          id="email-from"
          value={String(data.from ?? "")}
          onChange={(v) => onUpdate("from", v)}
          placeholder="noreply@yourdomain.com"
        />
      </div>

      <div>
        <FieldLabel htmlFor="email-to">To (comma-separated)</FieldLabel>
        <AutocompleteTextArea
          id="email-to"
          value={String(data.to ?? "")}
          onChange={(v) => onUpdate("to", v)}
          options={autocompleteOptions}
          placeholder="{{trigger.body.customer_email}}, ops@company.com"
          rows={2}
        />
      </div>

      <SectionDivider label="Content" />

      <div>
        <FieldLabel htmlFor="email-subject">Subject</FieldLabel>
        <AutocompleteTextArea
          id="email-subject"
          value={String(data.subject ?? "")}
          onChange={(v) => onUpdate("subject", v)}
          options={autocompleteOptions}
          placeholder="Your order #{{trigger.body.order_id}} is confirmed!"
          rows={1}
        />
      </div>

      <div>
        <FieldLabel htmlFor="email-html">HTML Body</FieldLabel>
        <AutocompleteTextArea
          id="email-html"
          value={String(data.html ?? "")}
          onChange={(v) => onUpdate("html", v)}
          options={autocompleteOptions}
          placeholder="<h1>Hello {{trigger.body.name}}</h1><p>Your order is ready.</p>"
          rows={6}
        />
      </div>

      <div>
        <FieldLabel htmlFor="email-text">Plain Text Fallback (optional)</FieldLabel>
        <AutocompleteTextArea
          id="email-text"
          value={String(data.text ?? "")}
          onChange={(v) => onUpdate("text", v)}
          options={autocompleteOptions}
          placeholder="Hello {{trigger.body.name}}, your order is ready."
          rows={3}
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Type <code className="rounded bg-muted px-1 font-mono text-[10px]">{"{{"}  </code> to insert variables from upstream nodes.
        </p>
      </div>
    </div>
  );
};

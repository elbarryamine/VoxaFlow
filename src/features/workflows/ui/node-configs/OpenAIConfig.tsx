"use client";

import type { NodeConfigProps } from "./shared";
import {
  FieldLabel,
  SelectInput,
  TextInput,
  SectionDivider,
  AutocompleteTextArea,
  CredentialPicker,
} from "./shared";

const OPENAI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Fast)" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

export const OpenAIConfig = ({ data, onUpdate, inputVariables }: NodeConfigProps) => {
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
        service="openai"
        value={data.credentialId as string | undefined}
        onChange={(id) => onUpdate("credentialId", id)}
      />

      <SectionDivider label="Model Settings" />

      <div>
        <FieldLabel htmlFor="openai-model">Model</FieldLabel>
        <SelectInput
          id="openai-model"
          value={String(data.model ?? "gpt-4o-mini")}
          onChange={(v) => onUpdate("model", v)}
          options={OPENAI_MODELS}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="openai-temperature">Temperature</FieldLabel>
          <TextInput
            id="openai-temperature"
            value={String(data.temperature ?? "0.7")}
            onChange={(v) => onUpdate("temperature", v)}
            placeholder="0.7"
          />
        </div>
        <div>
          <FieldLabel htmlFor="openai-max-tokens">Max Tokens</FieldLabel>
          <TextInput
            id="openai-max-tokens"
            value={String(data.maxTokens ?? "1000")}
            onChange={(v) => onUpdate("maxTokens", v)}
            placeholder="1000"
          />
        </div>
      </div>

      <SectionDivider label="Prompts" />

      <div>
        <FieldLabel htmlFor="openai-system">System Prompt (optional)</FieldLabel>
        <AutocompleteTextArea
          id="openai-system"
          value={String(data.systemPrompt ?? "")}
          onChange={(v) => onUpdate("systemPrompt", v)}
          options={autocompleteOptions}
          placeholder="You are a helpful assistant…"
          rows={2}
        />
      </div>

      <div>
        <FieldLabel htmlFor="openai-prompt">User Prompt</FieldLabel>
        <AutocompleteTextArea
          id="openai-prompt"
          value={String(data.prompt ?? "")}
          onChange={(v) => onUpdate("prompt", v)}
          options={autocompleteOptions}
          placeholder="Summarize: {{trigger.body.message}}"
          rows={4}
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Type <code className="rounded bg-muted px-1 font-mono text-[10px]">{"{{"}  </code> to insert variables from upstream nodes.
        </p>
      </div>
    </div>
  );
};

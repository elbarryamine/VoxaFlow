"use client";

import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextAreaInput, SectionDivider } from "./shared";
import { ConnectionPicker } from "@/src/features/connections";

const MODEL_OPTIONS = [
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  { value: "claude-sonnet", label: "Claude Sonnet" },
];

const getConnectionType = (modelName: string) =>
  modelName.startsWith("claude") ? "anthropic" : "openai";

export const AICustomModelConfig = ({ data, onUpdate }: NodeConfigProps) => {
  const modelName = String(data.modelName ?? "gpt-4.1");
  const connectionType = getConnectionType(modelName);

  return (
    <div className="space-y-4">
      <ConnectionPicker
        connectionType={connectionType}
        value={data.connectionId as string | undefined}
        onChange={(id) => onUpdate("connectionId", id)}
      />

      <SectionDivider label="Model Settings" />

      <div>
        <FieldLabel htmlFor="custom-model-name">Model</FieldLabel>
        <SelectInput
          id="custom-model-name"
          value={modelName}
          onChange={(value) => onUpdate("modelName", value)}
          options={MODEL_OPTIONS}
        />
      </div>

      <div>
        <FieldLabel htmlFor="custom-model-prompt">Prompt</FieldLabel>
        <TextAreaInput
          id="custom-model-prompt"
          value={String(data.modelPrompt ?? "")}
          onChange={(value) => onUpdate("modelPrompt", value)}
          placeholder="Summarize intent and return a lead score from 0 to 100..."
          rows={5}
        />
      </div>
    </div>
  );
};

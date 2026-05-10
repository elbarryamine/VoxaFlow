"use client";


import { ConnectionPicker } from "@/src/features/connections/ui/ConnectionPicker";
import {
  FieldLabel,
  SelectInput,
  TextInput,
  SectionDivider,
  AutocompleteTextArea,
  type NodeConfigProps,
  MODEL_OPTIONS,
  getConnectionType,
} from "./shared";


export const ConditionConfig = ({ data, onUpdate, inputVariables }: NodeConfigProps) => {
  const aiConditionPrompt = (data.aiConditionPrompt as string) ?? "";
  const modelName = String(data.modelName ?? "gpt-4.1-mini");
  const connectionType = getConnectionType(modelName);

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
      <ConnectionPicker
        connectionType={connectionType}
        value={data.connectionId as string | undefined}
        onChange={(id) => onUpdate("connectionId", id)}
      />

      <SectionDivider label="Node Details" />
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="step-name">Step Name</FieldLabel>
          <TextInput
            id="step-name"
            value={String(data.stepName ?? "Condition Step")}
            onChange={(v) => onUpdate("stepName", v)}
            placeholder="e.g. Qualifier"
          />
        </div>
        <div>
          <FieldLabel htmlFor="model-name">Model</FieldLabel>
          <SelectInput
            id="model-name"
            value={modelName}
            onChange={(v) => onUpdate("modelName", v)}
            options={MODEL_OPTIONS}
          />
        </div>
      </div>

      {modelName === "custom" && (
        <div>
          <FieldLabel htmlFor="custom-model-override">Custom Model Name</FieldLabel>
          <TextInput
            id="custom-model-override"
            value={String(data.customModelName ?? "")}
            onChange={(v) => onUpdate("customModelName", v)}
            placeholder="meta-llama/Llama-3..."
          />
        </div>
      )}

      <div>
        <FieldLabel htmlFor="step-description">Step Description</FieldLabel>
        <TextInput
          id="step-description"
          value={String(data.stepDescription ?? "")}
          onChange={(v) => onUpdate("stepDescription", v)}
          placeholder="What does this step decide?"
        />
      </div>

      <SectionDivider label="Decision Logic" />

      <div>
        <FieldLabel htmlFor="aiConditionPrompt">AI Decision Rule</FieldLabel>
        <AutocompleteTextArea
          id="aiConditionPrompt"
          value={aiConditionPrompt}
          onChange={(v) => onUpdate("aiConditionPrompt", v)}
          options={autocompleteOptions}
          placeholder="e.g., The user has budget and {{2.intent}} is 'purchase'"
          rows={5}
        />
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          The flow routes to <strong>Yes</strong> if this condition is met. Type <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono">{"{{"}</code> to insert variables.
        </p>
      </div>
    </div>
  );
};

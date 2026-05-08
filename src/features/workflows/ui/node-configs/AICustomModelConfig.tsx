"use client";

import type { NodeConfigProps } from "./shared";
import { 
  FieldLabel, 
  SelectInput, 
  TextAreaInput, 
  SectionDivider, 
  TextInput,
  MODEL_OPTIONS,
  getConnectionType,
  AutocompleteTextArea,
} from "./shared";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { ConnectionPicker } from "@/src/features/connections/ui/ConnectionPicker";

export const AICustomModelConfig = ({ data, onUpdate, inputVariables }: NodeConfigProps) => {
  const modelName = String(data.modelName ?? "gpt-4.1");
  const connectionType = getConnectionType(modelName);
  const outputFormat = String(data.outputFormat ?? "text");

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
  
  const jsonSchemaFields = (data.jsonSchemaFields as { name: string; type: string; description: string }[]) || [];

  const handleAddField = () => {
    onUpdate("jsonSchemaFields", [...jsonSchemaFields, { name: "", type: "string", description: "" }]);
  };

  const handleRemoveField = (index: number) => {
    onUpdate("jsonSchemaFields", jsonSchemaFields.filter((_, i) => i !== index));
  };

  const handleUpdateField = (index: number, key: keyof typeof jsonSchemaFields[0], value: string) => {
    const newFields = [...jsonSchemaFields];
    newFields[index] = { ...newFields[index], [key]: value };
    onUpdate("jsonSchemaFields", newFields);
  };

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

      {modelName === "custom" && (
        <div>
          <FieldLabel htmlFor="custom-model-override">Custom Model Name</FieldLabel>
          <TextInput
            id="custom-model-override"
            value={String(data.customModelName ?? "")}
            onChange={(value) => onUpdate("customModelName", value)}
            placeholder="e.g., meta-llama/Llama-3-70b-chat-hf"
          />
        </div>
      )}

      <div>
        <FieldLabel htmlFor="custom-model-output">Output Format</FieldLabel>
        <SelectInput
          id="custom-model-output"
          value={outputFormat}
          onChange={(value) => onUpdate("outputFormat", value)}
          options={[
            { value: "text", label: "Text (String)" },
            { value: "json", label: "JSON (Structured)" },
            { value: "branch", label: "Branch (Yes / No)" },
          ]}
        />
      </div>

      {outputFormat === "json" && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-3">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="custom-model-json-schema">JSON Schema Fields</FieldLabel>
            <button
              onClick={handleAddField}
              className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <Plus className="h-3 w-3" />
              Add Field
            </button>
          </div>
          
          <div className="space-y-3">
            {jsonSchemaFields.length === 0 ? (
              <p className="py-2 text-center text-[11px] text-muted-foreground/70">
                No fields defined. Add a field to structure the model output.
              </p>
            ) : (
              jsonSchemaFields.map((field, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-md border border-border/50 bg-background p-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <TextInput
                        value={field.name}
                        onChange={(val) => handleUpdateField(index, "name", val)}
                        placeholder="Field name (e.g., intent)"
                      />
                    </div>
                    <div className="w-[110px]">
                      <SelectInput
                        value={field.type}
                        onChange={(val) => handleUpdateField(index, "type", val)}
                        options={[
                          { value: "string", label: "String" },
                          { value: "number", label: "Number" },
                          { value: "boolean", label: "Boolean" },
                          { value: "object", label: "Object" },
                          { value: "array", label: "Array" },
                        ]}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveField(index)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <TextInput
                    value={field.description}
                    onChange={(val) => handleUpdateField(index, "description", val)}
                    placeholder="Description (optional)"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div>
        <FieldLabel htmlFor="custom-model-prompt">Prompt</FieldLabel>
        <AutocompleteTextArea
          id="custom-model-prompt"
          value={String(data.modelPrompt ?? "")}
          onChange={(value) => onUpdate("modelPrompt", value)}
          options={autocompleteOptions}
          placeholder="e.g., Summarize intent, or evaluate if the user has budget..."
          rows={5}
        />
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Type <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono">{"{{"}</code> to insert variables from upstream nodes.
        </p>
      </div>
    </div>
  );
};

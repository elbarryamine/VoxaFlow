"use client";

import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextAreaInput, TextInput, SectionDivider } from "./shared";
import { ConnectionPicker } from "@/src/features/connections/ui/ConnectionPicker";

const METHOD_OPTIONS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
];

export const ApiRequestConfig = ({
  data,
  onUpdate,
}: NodeConfigProps) => {
  const fields = Array.isArray(data.expectedOutputFields) ? data.expectedOutputFields : [];

  const handleAddField = () => {
    onUpdate("expectedOutputFields", [
      ...fields,
      { name: "", type: "string", description: "" },
    ]);
  };

  const handleUpdateField = (index: number, key: string, value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    onUpdate("expectedOutputFields", newFields);
  };

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onUpdate("expectedOutputFields", newFields);
  };

  return (
    <div className="space-y-4">
      <ConnectionPicker
        connectionType="webhook"
        value={data.connectionId as string | undefined}
        onChange={(id) => onUpdate("connectionId", id)}
      />

      <SectionDivider label="Request Settings" />

      <div>
        <FieldLabel htmlFor="api-method">Method</FieldLabel>
        <SelectInput
          id="api-method"
          value={String(data.method ?? "GET")}
          onChange={(value) => onUpdate("method", value)}
          options={METHOD_OPTIONS}
        />
      </div>

      <div>
        <FieldLabel htmlFor="api-url">URL</FieldLabel>
        <TextInput
          id="api-url"
          value={String(data.url ?? "")}
          onChange={(value) => onUpdate("url", value)}
          placeholder="https://api.example.com/v1/users/{{lead.id}}"
        />
      </div>

      <div>
        <FieldLabel htmlFor="api-headers">Headers (JSON format)</FieldLabel>
        <TextAreaInput
          id="api-headers"
          value={String(data.headersTemplate ?? "")}
          onChange={(value) => onUpdate("headersTemplate", value)}
          placeholder='{"Authorization": "Bearer {{token}}"}'
          rows={2}
        />
      </div>

      <div>
        <FieldLabel htmlFor="api-body">Request Body</FieldLabel>
        <TextAreaInput
          id="api-body"
          value={String(data.bodyTemplate ?? "")}
          onChange={(value) => onUpdate("bodyTemplate", value)}
          placeholder='{"name": "{{lead.name}}"}'
          rows={4}
        />
      </div>

      <SectionDivider label="Expected Output Format" />
      <p className="text-[11px] text-muted-foreground mt-[-8px]">
        Define fields returned by the API so subsequent nodes can access them via the variables tree.
      </p>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  value={field.name}
                  onChange={(v) => handleUpdateField(index, "name", v)}
                  placeholder="Field name (e.g., data.userId)"
                />
              </div>
              <div className="w-[100px]">
                <SelectInput
                  value={field.type}
                  onChange={(v) => handleUpdateField(index, "type", v)}
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
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Remove field"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <TextInput
              value={field.description}
              onChange={(v) => handleUpdateField(index, "description", v)}
              placeholder="Description (optional)"
            />
          </div>
        ))}
        
        <button
          onClick={handleAddField}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-transparent py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Add Expected Field
        </button>
      </div>
    </div>
  );
};

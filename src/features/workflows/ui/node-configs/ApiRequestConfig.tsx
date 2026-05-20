"use client";

import { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import type { NodeConfigProps } from "./shared";
import { FieldLabel, SelectInput, TextAreaInput, TextInput } from "./shared";
import { ConnectionPicker } from "@/src/features/connections/ui/ConnectionPicker";

const METHOD_OPTIONS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
];

interface KeyValueItem {
  key: string;
  value: string;
  description: string;
}

interface KeyValueEditorProps {
  items: KeyValueItem[];
  fieldKey: string;
  addButtonLabel: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  onUpdate: (
    field: string,
    value: string | number | boolean | unknown[] | Record<string, unknown> | undefined,
  ) => void;
}

const KeyValueEditor = ({
  items,
  fieldKey,
  addButtonLabel,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  onUpdate,
}: KeyValueEditorProps) => {
  const handleAdd = () => {
    onUpdate(fieldKey, [...items, { key: "", value: "", description: "" }]);
  };

  const handleUpdate = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate(fieldKey, newItems);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(fieldKey, newItems);
  };

  return (
    <div className="space-y-3 pt-2">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <TextInput
                value={item.key}
                onChange={(v) => handleUpdate(index, "key", v)}
                placeholder={keyPlaceholder}
              />
            </div>
            <div className="flex-1">
              <TextInput
                value={item.value}
                onChange={(v) => handleUpdate(index, "value", v)}
                placeholder={valuePlaceholder}
              />
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Remove item"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
          <TextInput
            value={item.description}
            onChange={(v) => handleUpdate(index, "description", v)}
            placeholder="Description (optional)"
          />
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-transparent py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        {addButtonLabel}
      </button>
    </div>
  );
};

export const ApiRequestConfig = ({
  data,
  onUpdate,
}: NodeConfigProps) => {
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body" | "output">("params");

  const fields = Array.isArray(data.expectedOutputFields) ? data.expectedOutputFields : [];
  const queryParams = Array.isArray(data.apiQueryParams) ? data.apiQueryParams : [];
  const headers = Array.isArray(data.apiHeaders) ? data.apiHeaders : [];
  const formData = Array.isArray(data.apiFormData) ? data.apiFormData : [];
  
  // Legacy fallback if headersTemplate string is still there, but we will prefer apiHeaders
  const bodyType = String(data.apiBodyType ?? "raw");

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
    <div className="space-y-5">
      <ConnectionPicker
        connectionType="webhook"
        value={data.connectionId as string | undefined}
        onChange={(id) => onUpdate("connectionId", id)}
      />

      <div className="flex gap-2 items-start">
        <div className="w-[110px]">
          <FieldLabel htmlFor="api-method">Method</FieldLabel>
          <SelectInput
            id="api-method"
            value={String(data.method ?? "GET")}
            onChange={(value) => onUpdate("method", value)}
            options={METHOD_OPTIONS}
          />
        </div>
        <div className="flex-1">
          <FieldLabel htmlFor="api-url">URL</FieldLabel>
          <TextInput
            id="api-url"
            value={String(data.url ?? "")}
            onChange={(value) => onUpdate("url", value)}
            placeholder="https://api.example.com/v1/..."
          />
        </div>
      </div>

      <div className="flex space-x-1 border-b border-border/50 text-[13px] font-medium overflow-x-auto no-scrollbar">
        {(
          [
            { id: "params", label: "Params" },
            { id: "headers", label: "Headers" },
            { id: "body", label: "Body" },
            { id: "output", label: "Output" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        {activeTab === "params" && (
          <KeyValueEditor 
            items={queryParams} 
            fieldKey="apiQueryParams" 
            addButtonLabel="Add Query Parameter" 
            onUpdate={onUpdate}
          />
        )}

        {activeTab === "headers" && (
          <div className="space-y-4 pt-2">
            <KeyValueEditor 
              items={headers} 
              fieldKey="apiHeaders" 
              addButtonLabel="Add Header" 
              keyPlaceholder="Authorization, Content-Type..."
              onUpdate={onUpdate}
            />
            
            <div className="mt-6 pt-4 border-t border-border/50">
              <FieldLabel htmlFor="api-headers">Raw Headers (JSON fallback)</FieldLabel>
              <TextAreaInput
                id="api-headers"
                value={String(data.headersTemplate ?? "")}
                onChange={(value) => onUpdate("headersTemplate", value)}
                placeholder='{"Authorization": "Bearer {{token}}"}'
                rows={2}
              />
            </div>
          </div>
        )}

        {activeTab === "body" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4 border-b border-border/50 pb-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="radio"
                  name="bodyType"
                  value="none"
                  checked={bodyType === "none"}
                  onChange={(e) => onUpdate("apiBodyType", e.target.value)}
                  className="text-primary accent-primary"
                />
                none
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="radio"
                  name="bodyType"
                  value="form-data"
                  checked={bodyType === "form-data"}
                  onChange={(e) => onUpdate("apiBodyType", e.target.value)}
                  className="text-primary accent-primary"
                />
                form-data
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="radio"
                  name="bodyType"
                  value="raw"
                  checked={bodyType === "raw"}
                  onChange={(e) => onUpdate("apiBodyType", e.target.value)}
                  className="text-primary accent-primary"
                />
                raw
              </label>
            </div>
            
            {bodyType === "none" && (
              <div className="text-sm text-muted-foreground italic py-4 text-center">
                This request does not have a body
              </div>
            )}
            
            {bodyType === "form-data" && (
              <KeyValueEditor 
                items={formData} 
                fieldKey="apiFormData" 
                addButtonLabel="Add Form Data Field" 
                onUpdate={onUpdate}
              />
            )}

            {bodyType === "raw" && (
              <div>
                <TextAreaInput
                  id="api-body"
                  value={String(data.bodyTemplate ?? "")}
                  onChange={(value) => onUpdate("bodyTemplate", value)}
                  placeholder='{&#10;  "name": "{{lead.name}}"&#10;}'
                  rows={8}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "output" && (
          <div className="space-y-4 pt-2">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Define fields returned by the API so subsequent nodes can access them via variables.
            </p>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <TextInput
                        value={field.name}
                        onChange={(v) => handleUpdateField(index, "name", v)}
                        placeholder="Field (e.g., data.userId)"
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
        )}
      </div>
    </div>
  );
};


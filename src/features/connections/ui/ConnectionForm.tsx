"use client";

import { useState } from "react";
import { Eye, EyeSlash, X } from "@phosphor-icons/react/dist/ssr";
import type { Connection, ConnectionType } from "../types/Connection.types";
import {
  CONNECTION_TYPE_LABELS,
  CONNECTION_CREDENTIAL_FIELDS,
} from "../types/Connection.types";
import { useConnectionsStore } from "../store/useConnectionsStore";

const TYPE_OPTIONS = (
  Object.keys(CONNECTION_TYPE_LABELS) as ConnectionType[]
).map((type) => ({ value: type, label: CONNECTION_TYPE_LABELS[type] }));

interface ConnectionFormProps {
  initial?: Connection;
  fixedType?: ConnectionType;
  onSave: (connection: Connection) => void;
  onCancel: () => void;
  compact?: boolean;
}

export const ConnectionForm = ({
  initial,
  fixedType,
  onSave,
  onCancel,
  compact = false,
}: ConnectionFormProps) => {
  const { addConnection, updateConnection } = useConnectionsStore();
  const defaultType = fixedType ?? initial?.type ?? "openai";

  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<ConnectionType>(defaultType);
  const [credentials, setCredentials] = useState<Record<string, string>>(
    initial?.credentials ?? {},
  );
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = CONNECTION_CREDENTIAL_FIELDS[type];

  const setField = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    fields.forEach((f) => {
      if (!f.optional && !credentials[f.key]?.trim()) {
        next[f.key] = `${f.label} is required`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (initial) {
      updateConnection(initial.id, { name, type, credentials });
      onSave({ ...initial, name, type, credentials });
    } else {
      const created = addConnection({
        name,
        type,
        credentials,
        status: "connected",
      });
      onSave(created);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring disabled:cursor-not-allowed disabled:opacity-50";

  const labelClass =
    "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

  const errorClass = "mt-1 text-[11px] text-red-500";

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {initial ? "Edit Connection" : "New Connection"}
          </h3>
          <button
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
            if (errors.name) setErrors((p) => ({ ...p, name: "" }));
          }}
          placeholder="My connection"
          className={inputClass}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      {!fixedType && (
        <div>
          <label className={labelClass}>Provider</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.currentTarget.value as ConnectionType);
              setCredentials({});
            }}
            className={inputClass}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.key}>
          <label className={labelClass}>
            {field.label}
            {field.optional && (
              <span className="ml-1 normal-case tracking-normal text-muted-foreground/60">
                (optional)
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type={
                field.secret && !showSecrets[field.key] ? "password" : "text"
              }
              value={credentials[field.key] ?? ""}
              onChange={(e) => setField(field.key, e.currentTarget.value)}
              placeholder={field.placeholder}
              className={`${inputClass} ${field.secret ? "pr-9" : ""}`}
            />
            {field.secret && (
              <button
                type="button"
                onClick={() =>
                  setShowSecrets((prev) => ({
                    ...prev,
                    [field.key]: !prev[field.key],
                  }))
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showSecrets[field.key] ? (
                  <EyeSlash className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
          {errors[field.key] && (
            <p className={errorClass}>{errors[field.key]}</p>
          )}
        </div>
      ))}

      <div className={`flex gap-2 ${compact ? "pt-1" : "pt-2"}`}>
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {initial ? "Save changes" : "Add connection"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

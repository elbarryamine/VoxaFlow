"use client";

import { useState } from "react";
import {
  CaretDown,
  Plus,
  CheckCircle,
  WarningCircle,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ConnectionType } from "../types/Connection.types";
import { CONNECTION_TYPE_LABELS } from "../types/Connection.types";
import { useConnectionsStore } from "../store/useConnectionsStore";
import { ConnectionForm } from "./ConnectionForm";

const STATUS_ICON = {
  connected: <CheckCircle className="h-3 w-3 text-emerald-500" />,
  error: <WarningCircle className="h-3 w-3 text-red-500" />,
};

interface ConnectionPickerProps {
  connectionType: ConnectionType;
  value: string | undefined;
  onChange: (connectionId: string) => void;
}

export const ConnectionPicker = ({
  connectionType,
  value,
  onChange,
}: ConnectionPickerProps) => {
  const { getByType } = useConnectionsStore();
  const [showInlineForm, setShowInlineForm] = useState(false);
  const connections = getByType(connectionType);
  const typeLabel = CONNECTION_TYPE_LABELS[connectionType];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {typeLabel} Connection
        </span>
        <Link
          href="/dashboard/connections"
          className="flex items-center gap-1 text-[10px] text-primary hover:underline"
        >
          Manage
          <ArrowSquareOut className="h-2.5 w-2.5" />
        </Link>
      </div>

      {connections.length > 0 && !showInlineForm ? (
        <div className="relative">
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.currentTarget.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none transition-colors focus:border-ring"
          >
            <option value="" disabled>
              Select a connection…
            </option>
            {connections.map((conn) => (
              <option key={conn.id} value={conn.id}>
                {conn.name}
              </option>
            ))}
          </select>
          <CaretDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      ) : !showInlineForm ? null : null}

      {value &&
        !showInlineForm &&
        (() => {
          const conn = connections.find((c) => c.id === value);
          if (!conn) return null;
          return (
            <div className="flex items-center gap-1.5">
              {STATUS_ICON[conn.status]}
              <span className="text-[11px] text-muted-foreground capitalize">
                {conn.status}
              </span>
            </div>
          );
        })()}

      {connections.length === 0 && !showInlineForm && (
        <p className="text-[11px] text-muted-foreground">
          No {typeLabel} connections yet.
        </p>
      )}

      {!showInlineForm ? (
        <button
          onClick={() => setShowInlineForm(true)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
        >
          <Plus className="h-3 w-3" />
          Add new {typeLabel} connection
        </button>
      ) : (
        <div className="rounded-lg border border-border bg-background p-3">
          <ConnectionForm
            fixedType={connectionType}
            compact
            onSave={(conn) => {
              onChange(conn.id);
              setShowInlineForm(false);
            }}
            onCancel={() => setShowInlineForm(false)}
          />
        </div>
      )}
    </div>
  );
};

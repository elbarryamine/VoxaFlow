"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Robot,
  FileXls,
  Envelope,
  ChatCircleText,
  Globe,
  CheckCircle,
  WarningCircle,
  DotsThreeVertical,
  Trash,
  Pencil,
} from "@phosphor-icons/react/dist/ssr";
import type { Connection, ConnectionType } from "../types/Connection.types";
import { CONNECTION_TYPE_LABELS } from "../types/Connection.types";
import { useConnectionsStore } from "../store/useConnectionsStore";

const TYPE_ICONS: Record<
  ConnectionType,
  React.ComponentType<{ className?: string }>
> = {
  openai: Robot,
  anthropic: Robot,
  slack: ChatCircleText,
  "google-sheets": FileXls,
  email: Envelope,
  webhook: Globe,
};

const TYPE_COLORS: Record<ConnectionType, string> = {
  openai: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  anthropic: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  slack: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "google-sheets": "bg-green-500/10 text-green-600 dark:text-green-400",
  email: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  webhook: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const STATUS_CONFIG = {
  connected: {
    icon: CheckCircle,
    label: "Connected",
    className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  error: {
    icon: WarningCircle,
    label: "Error",
    className: "text-red-600 dark:text-red-400 bg-red-500/10",
  },
} as const;

interface ConnectionCardProps {
  connection: Connection;
}

export const ConnectionCard = ({ connection }: ConnectionCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { deleteConnection } = useConnectionsStore();
  const Icon = TYPE_ICONS[connection.type];
  const status = STATUS_CONFIG[connection.status];
  const StatusIcon = status.icon;

  const handleDelete = () => {
    setMenuOpen(false);
    deleteConnection(connection.id);
  };

  const formattedDate = new Date(connection.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${TYPE_COLORS[connection.type]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {connection.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {CONNECTION_TYPE_LABELS[connection.type]}
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <DotsThreeVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-20 min-w-[140px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                <Link
                  href={`/dashboard/connections/${connection.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                >
                  <Trash className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
        >
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Added {formattedDate}
        </span>
      </div>
    </div>
  );
};

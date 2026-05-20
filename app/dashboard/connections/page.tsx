"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";
import type { Connection, ConnectionType } from "@/src/features/connections/types/Connection.types";
import { CONNECTION_TYPE_LABELS } from "@/src/features/connections/types/Connection.types";
import { useConnectionsStore } from "@/src/features/connections/store/useConnectionsStore";
import { ConnectionCard } from "@/src/features/connections/ui/ConnectionCard";

const TYPE_ORDER: ConnectionType[] = [
  "openai",
  "anthropic",
  "slack",
  "google-sheets",
  "email",
  "webhook",
];

export default function ConnectionsPage() {
  const { connections } = useConnectionsStore();

  const grouped = TYPE_ORDER.reduce(
    (acc, type) => {
      const items = connections.filter((c) => c.type === type);
      if (items.length > 0) acc[type] = items;
      return acc;
    },
    {} as Partial<Record<ConnectionType, Connection[]>>,
  );

  const hasConnections = connections.length > 0;

  return (
    <>
      <PageLayout
        title="Connections"
        description="Manage credentials for AI providers, messaging platforms, and data services"
        actions={
          <TopBarLink href="/dashboard/connections/new">
            <Plus className="h-4 w-4" weight="bold" />
            New Connection
          </TopBarLink>
        }
      >
        <div className="space-y-10">
          {!hasConnections && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
              <p className="text-sm font-medium text-foreground">
                No connections yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first connection to get started
              </p>
              <Link
                href="/dashboard/connections/new"
                className="mt-4 flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Connection
              </Link>
            </div>
          )}

          {/* Grouped by type */}
          {(Object.keys(grouped) as ConnectionType[]).map((type) => (
            <section key={type}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-sm font-semibold text-foreground">
                  {CONNECTION_TYPE_LABELS[type]}
                </h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  {grouped[type]!.length} connection
                  {grouped[type]!.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {grouped[type]!.map((conn) => (
                  <ConnectionCard key={conn.id} connection={conn} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </PageLayout>
    </>
  );
}

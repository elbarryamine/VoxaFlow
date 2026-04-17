"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui";
import {
  ConnectionForm,
  useConnectionsStore,
} from "@/src/features/connections";

export default function ConnectionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { connections } = useConnectionsStore();
  const connectionId = params.id;
  const isNew = connectionId === "new";

  const existingConnection = useMemo(
    () => connections.find((connection) => connection.id === connectionId),
    [connections, connectionId],
  );

  if (!isNew && !existingConnection) {
    router.replace("/dashboard/connections");
    return null;
  }

  const pageTitle = isNew ? "New Connection" : "Edit Connection";
  const pageDescription = isNew
    ? "Create a reusable connection for your workflow nodes"
    : "Update a reusable connection used by your workflow nodes";

  const contentTitle = isNew ? "Create Reusable Connection" : "Edit Connection";
  const contentDescription = isNew
    ? "Set up provider credentials once, then reuse them across workflow nodes."
    : "Update credentials and keep connected workflows running smoothly.";

  return (
    <PageLayout
      title={pageTitle}
      description={pageDescription}
      backHref="/dashboard/connections"
      withContentPadding={false}
      contentClassName="px-8 pb-8"
    >
      <div className="mx-auto w-full max-w-5xl py-8">
        <h2 className="text-2xl font-bold">{contentTitle}</h2>
        <p className="mt-1 text-muted-foreground">{contentDescription}</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <ConnectionForm
              initial={existingConnection}
              onSave={() => router.push("/dashboard/connections")}
              onCancel={() => router.push("/dashboard/connections")}
            />
          </section>

          <aside className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Link className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  How Connections Work
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {isNew ? (
                  <>
                    <li>- Store API credentials once per provider</li>
                    <li>- Reuse the same connection in multiple workflows</li>
                    <li>- Rotate credentials by editing one connection</li>
                  </>
                ) : (
                  <>
                    <li>- Existing workflows keep using this connection</li>
                    <li>- Provider type controls required credential fields</li>
                    <li>- Save once and changes apply everywhere it is used</li>
                  </>
                )}
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Best Practices
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {isNew ? (
                  <>
                    <li>- Use descriptive names by environment and provider</li>
                    <li>- Keep credentials scoped to least privilege</li>
                    <li>- Test connection usage from a workflow node</li>
                  </>
                ) : (
                  <>
                    <li>- Rotate secrets during maintenance windows</li>
                    <li>- Validate updates with a quick workflow test run</li>
                    <li>- Use names that clearly indicate environment</li>
                  </>
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}

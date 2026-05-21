"use client";

import { useState, useEffect } from "react";
import {
  Key,
  Plus,
  Eye,
  EyeSlash,
  CircleNotch,
  CheckCircle,
  XCircle,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

import { PageLayout } from "@/src/shared/ui/PageLayout";
import { ModalShell } from "@/src/shared/ui/ModalShell";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
import { CredentialsList } from "@/src/features/credentials/ui/CredentialsList";
import {
  CREDENTIAL_SERVICES,
  DEFAULT_CREDENTIAL_SERVICE,
} from "@/src/features/credentials/constants/CREDENTIAL_SERVICES";
import type {
  Credential,
  CredentialService,
} from "@/src/features/credentials/types/Credential.types";

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    service: DEFAULT_CREDENTIAL_SERVICE as CredentialService,
    fields: {} as Record<string, string>,
  });

  const [showFields, setShowFields] = useState<Record<string, boolean>>({});

  async function fetchCredentials() {
    setLoading(true);
    const res = await fetch("/api/credentials");
    if (res.ok) {
      const data = await res.json();
      setCredentials(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      fetchCredentials();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  function handleServiceChange(service: CredentialService) {
    setForm((prev) => ({ ...prev, service, fields: {} }));
    setShowFields({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const serviceConf = CREDENTIAL_SERVICES[form.service];
    const missingField = serviceConf.fields.find(
      (f) => f.sensitive && !form.fields[f.key]?.trim(),
    );
    if (missingField) {
      setError(`${missingField.label} is required`);
      setSaving(false);
      return;
    }

    const res = await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        service: form.service,
        data: form.fields,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      setError(body.error || "Failed to save credential");
    } else {
      setSuccess("Credential saved successfully");
      setShowForm(false);
      setForm({ name: "", service: DEFAULT_CREDENTIAL_SERVICE, fields: {} });
      fetchCredentials();
      setTimeout(() => setSuccess(null), 3000);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/credentials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCredentials((prev) => prev.filter((c) => c.id !== id));
    }
    setDeletingId(null);
  }

  const serviceConf = CREDENTIAL_SERVICES[form.service];
  const isEmpty = !loading && credentials.length === 0 && !showForm;

  return (
    <PageLayout
      title="Credentials"
      description="Securely store API keys used by your workflow nodes"
      contentClassName={
        isEmpty || loading ? "flex min-h-0 flex-1 flex-col" : undefined
      }
      actions={
        <TopBarButton onClick={() => { setShowForm(true); setError(null); }}>
          <Plus className="h-4 w-4" weight="bold" />
          Add Credential
        </TopBarButton>
      }
    >
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-4 font-manrope text-[14px] font-bold text-success shadow-sm">
          <CheckCircle className="h-5 w-5 shrink-0" weight="duotone" />
          {success}
        </div>
      )}

      <ModalShell
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setError(null);
        }}
        title="New credential"
        description="Add an API key or token for external services"
        icon={Key}
        maxWidthClass="max-w-xl"
        onOpen={() => setError(null)}
        footer={
          <>
            <TopBarButton
              variant="secondary"
              type="button"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
            >
              Cancel
            </TopBarButton>
            <TopBarButton
              type="submit"
              form="new-credential-form"
              disabled={saving}
            >
              {saving ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save credential"
              )}
            </TopBarButton>
          </>
        }
      >
        <form
          id="new-credential-form"
          onSubmit={handleSubmit}
          className="space-y-6 font-manrope"
        >
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error/10 px-5 py-4 text-[14px] font-bold text-error shadow-sm">
              <XCircle className="h-5 w-5 shrink-0" weight="duotone" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
                Display Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder='e.g. "My Key"'
                className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
                Service
              </label>
              <select
                value={form.service}
                onChange={(e) =>
                  handleServiceChange(e.target.value as CredentialService)
                }
                className="w-full appearance-none rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {Object.entries(CREDENTIAL_SERVICES).map(([key, conf]) => (
                  <option key={key} value={key}>
                    {conf.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {serviceConf.fields.map((field) => (
            <div key={field.key}>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-on-surface-variant">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={
                    field.sensitive && !showFields[field.key]
                      ? "password"
                      : "text"
                  }
                  value={form.fields[field.key] || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      fields: { ...p.fields, [field.key]: e.target.value },
                    }))
                  }
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 pr-11 font-mono text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {field.sensitive && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowFields((p) => ({
                        ...p,
                        [field.key]: !p[field.key],
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {showFields[field.key] ? (
                      <EyeSlash className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-surface-variant/20 p-4">
            <ShieldCheck
              className="h-6 w-6 shrink-0 text-primary"
              weight="duotone"
            />
            <p className="text-[13px] font-medium leading-relaxed text-on-surface-variant/90">
              Keys are encrypted before storage and never returned to the UI
              after saving. Reference credentials in nodes using their ID.
            </p>
          </div>
        </form>
      </ModalShell>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <CircleNotch className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isEmpty ? (
        <EmptyState
          layout="page"
          icon={Key}
          title="No credentials yet"
          description="Add API keys so your workflow nodes can authenticate with external services securely."
          action={
            <TopBarButton
              onClick={() => {
                setShowForm(true);
                setError(null);
              }}
            >
              <Plus className="h-4 w-4" weight="bold" />
              Add your first credential
            </TopBarButton>
          }
        />
      ) : (
        <CredentialsList
          credentials={credentials}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import {
  Key,
  Plus,
  Trash,
  Eye,
  EyeSlash,
  CircleNotch,
  CheckCircle,
  XCircle,
  Robot,
  Lightning,
  Globe,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";

interface Credential {
  id: string;
  name: string;
  service: string;
  created_at: string;
}

const SERVICE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; fields: { key: string; label: string; placeholder: string; sensitive?: boolean }[] }
> = {
  openai: {
    label: "OpenAI",
    icon: Robot,
    fields: [{ key: "apiKey", label: "API Key", placeholder: "sk-...", sensitive: true }],
  },
  slack: {
    label: "Slack",
    icon: Lightning,
    fields: [{ key: "botToken", label: "Bot Token", placeholder: "xoxb-...", sensitive: true }],
  },
  http: {
    label: "HTTP / Generic API",
    icon: Globe,
    fields: [
      { key: "apiKey", label: "API Key / Bearer Token", placeholder: "your-api-key", sensitive: true },
      { key: "baseUrl", label: "Base URL (optional)", placeholder: "https://api.example.com" },
    ],
  },
  resend: {
    label: "Resend (Email)",
    icon: EnvelopeSimple,
    fields: [{ key: "apiKey", label: "Resend API Key", placeholder: "re_...", sensitive: true }],
  },
};

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
    service: "openai",
    fields: {} as Record<string, string>,
  });

  const [showFields, setShowFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCredentials();
  }, []);

  async function fetchCredentials() {
    setLoading(true);
    const res = await fetch("/api/credentials");
    if (res.ok) {
      const data = await res.json();
      setCredentials(data);
    }
    setLoading(false);
  }

  function handleServiceChange(service: string) {
    setForm((prev) => ({ ...prev, service, fields: {} }));
    setShowFields({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const serviceConf = SERVICE_CONFIG[form.service];
    const missingField = serviceConf.fields.find(
      (f) => f.sensitive && !form.fields[f.key]?.trim()
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
      setForm({ name: "", service: "openai", fields: {} });
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

  const serviceConf = SERVICE_CONFIG[form.service];

  return (
    <PageLayout
      title="Credentials"
      description="Securely store API keys used by your workflow nodes"
      actions={
        <button
          onClick={() => { setShowForm(true); setError(null); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" weight="bold" />
          Add Credential
        </button>
      }
    >
      <div className="space-y-5">
        {/* Feedback banners */}
        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
            <CheckCircle className="h-4 w-4 shrink-0" weight="fill" />
            {success}
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-foreground">New Credential</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <XCircle className="h-4 w-4 shrink-0" weight="fill" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Display Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder='e.g. "My OpenAI Key"'
                    className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder-muted-foreground/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Service
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    {Object.entries(SERVICE_CONFIG).map(([key, conf]) => (
                      <option key={key} value={key}>{conf.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {serviceConf.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={field.sensitive && !showFields[field.key] ? "password" : "text"}
                      value={form.fields[field.key] || ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          fields: { ...p.fields, [field.key]: e.target.value },
                        }))
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 pr-10 text-sm text-foreground placeholder-muted-foreground/50 font-mono outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                    {field.sensitive && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowFields((p) => ({ ...p, [field.key]: !p[field.key] }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showFields[field.key] ? (
                          <EyeSlash className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <p className="text-[11px] text-muted-foreground/70">
                🔒 Keys are encoded before storage and never returned to the UI after saving. Reference credentials in nodes using their ID.
              </p>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(null); }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving && <CircleNotch className="h-4 w-4 animate-spin" />}
                  {saving ? "Saving…" : "Save Credential"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <CircleNotch className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : credentials.length === 0 && !showForm ? (
          <div className="flex h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Key className="h-7 w-7 text-primary" weight="duotone" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-foreground">No credentials yet</h3>
            <p className="mb-5 max-w-xs text-sm text-muted-foreground">
              Add API keys so your workflow nodes can authenticate with external services.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" weight="bold" />
              Add your first credential
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {credentials.map((cred) => {
              const conf = SERVICE_CONFIG[cred.service];
              const Icon = conf?.icon ?? Key;
              return (
                <div
                  key={cred.id}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" weight="duotone" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{cred.name}</p>
                      <p className="text-[11px] text-muted-foreground">{conf?.label ?? cred.service}</p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">{cred.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cred.id)}
                    disabled={deletingId === cred.id}
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all group-hover:opacity-100",
                      "hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    )}
                    title="Delete credential"
                  >
                    {deletingId === cred.id ? (
                      <CircleNotch className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" weight="bold" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

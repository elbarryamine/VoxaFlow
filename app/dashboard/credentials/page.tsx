"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/src/shared/ui/PageLayout";
import { ModalShell } from "@/src/shared/ui/ModalShell";
import { TopBarButton } from "@/src/shared/ui/TopBarButton";
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
  ShieldCheck,
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
        <TopBarButton onClick={() => { setShowForm(true); setError(null); }}>
          <Plus className="h-4 w-4" weight="bold" />
          Add Credential
        </TopBarButton>
      }
    >
      <div className="space-y-6">
        {/* Feedback banners */}
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-4 font-manrope text-[14px] font-bold text-success shadow-sm">
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
                      <label className="mb-2 block text-[13px] font-bold text-on-surface-variant uppercase tracking-wide">
                        Display Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder='e.g. "My Key"'
                        className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-bold text-on-surface-variant uppercase tracking-wide">
                        Service
                      </label>
                      <select
                        value={form.service}
                        onChange={(e) => handleServiceChange(e.target.value)}
                        className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 text-[14px] text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        {Object.entries(SERVICE_CONFIG).map(([key, conf]) => (
                          <option key={key} value={key}>{conf.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {serviceConf.fields.map((field) => (
                    <div key={field.key}>
                      <label className="mb-2 block text-[13px] font-bold text-on-surface-variant uppercase tracking-wide">
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
                          className="w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 pr-11 text-[14px] font-mono text-on-surface placeholder-on-surface-variant/50 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        {field.sensitive && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowFields((p) => ({ ...p, [field.key]: !p[field.key] }))
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
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
                    <ShieldCheck className="h-6 w-6 shrink-0 text-primary" weight="duotone" />
                    <p className="text-[13px] font-medium leading-relaxed text-on-surface-variant/90">
                      Keys are encrypted before storage and never returned to the UI after saving. Reference credentials in nodes using their ID.
                    </p>
                  </div>

                </form>
        </ModalShell>

        {/* List */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <CircleNotch className="h-8 w-8 animate-spin text-on-surface-variant" />
          </div>
        ) : credentials.length === 0 && !showForm ? (
          <div className="flex h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-card/40 text-center font-manrope transition-colors hover:bg-card/60">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container/60">
              <Key className="h-8 w-8 text-on-secondary-container" weight="duotone" />
            </div>
            <h3 className="mb-2 font-newsreader text-2xl font-bold text-on-surface">No credentials yet</h3>
            <p className="mb-6 max-w-sm text-[15px] font-medium text-on-surface-variant">
              Add API keys so your workflow nodes can authenticate with external services securely.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-on-primary shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              <Plus className="h-5 w-5" weight="bold" />
              Add your first credential
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {credentials.map((cred) => {
              const conf = SERVICE_CONFIG[cred.service];
              const Icon = conf?.icon ?? Key;
              return (
                <div
                  key={cred.id}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-lg font-manrope"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-container/60 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-on-secondary-container" weight="duotone" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">{cred.name}</p>
                      <p className="text-[13px] font-semibold text-on-surface-variant">{conf?.label ?? cred.service}</p>
                      <p className="mt-1.5 font-mono text-[11px] font-bold tracking-widest text-on-surface-variant/70">{cred.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cred.id)}
                    disabled={deletingId === cred.id}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-on-surface-variant opacity-0 transition-all group-hover:opacity-100",
                      "hover:bg-error/10 hover:text-error disabled:opacity-40"
                    )}
                    title="Delete credential"
                  >
                    {deletingId === cred.id ? (
                      <CircleNotch className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash className="h-5 w-5" weight="duotone" />
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FloppyDisk,
  Sparkle,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

const VOICES = [
  { id: "alloy", label: "Alloy", description: "Neutral and balanced" },
  { id: "echo", label: "Echo", description: "Warm and conversational" },
  { id: "fable", label: "Fable", description: "Expressive and dynamic" },
  { id: "onyx", label: "Onyx", description: "Deep and authoritative" },
  { id: "nova", label: "Nova", description: "Friendly and upbeat" },
  { id: "shimmer", label: "Shimmer", description: "Soft and calm" },
];

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "fr", label: "French" },
  { id: "es", label: "Spanish" },
  { id: "de", label: "German" },
  { id: "ar", label: "Arabic" },
];

export const AgentForm = () => {
  const router = useRouter();
  const [selectedVoice, setSelectedVoice] = useState("nova");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: agentName,
          description,
          instructions,
          voice: selectedVoice,
          language: selectedLanguage,
          status,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create agent");
      }

      router.push("/dashboard/agents");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-8">
      <h2 className="text-2xl font-bold">Create Professional Voice Agent</h2>
      <p className="mt-1 text-muted-foreground">
        Configure voice, behavior, and knowledge sources for AI-powered conversations.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Agent Identity
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Agent Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise Sales Assistant"
                  value={agentName}
                  onChange={(event) => setAgentName(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the business function and tone..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  System Prompt
                </label>
                <textarea
                  rows={6}
                  placeholder="You are an enterprise-grade voice assistant. Follow policy, stay concise, and escalate when required..."
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Runtime Configuration
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(event) => setSelectedVoice(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {VOICES.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.label} — {voice.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as "active" | "draft")
                  }
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Language
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                        selectedLanguage === lang.id
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <h4 className="text-sm font-semibold">Readiness</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>- Identity configured</li>
              <li>- Voice and model selected</li>
              <li>- Knowledge base connected</li>
            </ul>
          </section>
        </aside>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FloppyDisk className="h-4 w-4" />
          {isSubmitting ? "Creating..." : "Create Agent"}
        </button>
      </div>
    </div>
  );
};

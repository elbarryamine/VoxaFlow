"use client";

import { useState } from "react";
import {
  X,
  ArrowSquareOut,
  CheckCircle,
  Circle,
  Download,
} from "@phosphor-icons/react/dist/ssr";

interface TwilioNumber {
  sid: string;
  number: string;
  friendlyName: string;
  country: string;
  capabilities: string[];
}

const MOCK_TWILIO_NUMBERS: TwilioNumber[] = [
  {
    sid: "PN1",
    number: "+1 (646) 555-0210",
    friendlyName: "Twilio US East",
    country: "US",
    capabilities: ["Voice", "SMS"],
  },
  {
    sid: "PN2",
    number: "+1 (720) 555-0193",
    friendlyName: "Twilio US West",
    country: "US",
    capabilities: ["Voice"],
  },
  {
    sid: "PN3",
    number: "+44 20 7946 0921",
    friendlyName: "Twilio UK London",
    country: "GB",
    capabilities: ["Voice", "SMS"],
  },
  {
    sid: "PN4",
    number: "+49 30 9010 1234",
    friendlyName: "Twilio DE Berlin",
    country: "DE",
    capabilities: ["Voice"],
  },
];

type Step = "credentials" | "select" | "done";

interface ImportTwilioModalProps {
  onClose: () => void;
}

export const ImportTwilioModal = ({ onClose }: ImportTwilioModalProps) => {
  const [step, setStep] = useState<Step>("credentials");
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleNumber = (sid: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) {
        next.delete(sid);
      } else {
        next.add(sid);
      }
      return next;
    });

  const handleConnect = () => {
    if (accountSid && authToken) setStep("select");
  };

  const handleImport = () => {
    if (selected.size > 0) setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
              <span className="text-base font-bold text-warning">T</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Import from Twilio
              </h2>
              <p className="text-xs text-muted-foreground">
                Connect your Twilio account to import numbers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-0 border-b border-border px-6 py-3">
          {(["credentials", "select", "done"] as Step[]).map((s, i) => {
            const labels = ["Connect", "Select Numbers", "Done"];
            const isDone = ["credentials", "select", "done"].indexOf(step) > i;
            const isActive = step === s;
            return (
              <div key={s} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                      isDone
                        ? "bg-success text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-border text-muted-foreground"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {labels[i]}
                  </span>
                </div>
                {i < 2 && <div className="mx-3 h-px w-8 bg-border" />}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-5">
          {step === "credentials" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your Twilio credentials. You can find them in your{" "}
                <a
                  href="https://console.twilio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-primary hover:text-primary/80"
                >
                  Twilio Console <ArrowSquareOut className="h-3 w-3" />
                </a>
                .
              </p>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Account SID
                </label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Auth Token
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
          )}

          {step === "select" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Found{" "}
                <span className="font-semibold text-foreground">
                  {MOCK_TWILIO_NUMBERS.length}
                </span>{" "}
                phone numbers in your Twilio account. Select the ones you want
                to import.
              </p>
              <div className="space-y-2">
                {MOCK_TWILIO_NUMBERS.map((n) => {
                  const isSelected = selected.has(n.sid);
                  return (
                    <button
                      key={n.sid}
                      onClick={() => toggleNumber(n.sid)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "border-primary/40 bg-secondary"
                          : "border-border bg-background hover:border-primary/20"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {n.number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {n.friendlyName} · {n.capabilities.join(", ")}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {n.country}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                Import Successful
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {selected.size}
                </span>{" "}
                {selected.size === 1 ? "number has" : "numbers have"} been
                imported from Twilio.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            {step === "done" ? "Close" : "Cancel"}
          </button>
          {step === "credentials" && (
            <button
              onClick={handleConnect}
              disabled={!accountSid || !authToken}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Connect Account
            </button>
          )}
          {step === "select" && (
            <button
              onClick={handleImport}
              disabled={selected.size === 0}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              Import {selected.size > 0 ? `(${selected.size})` : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

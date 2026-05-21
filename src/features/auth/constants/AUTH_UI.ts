import type { Icon } from "@phosphor-icons/react";
import {
  GitBranch,
  Key,
  Plugs,
  Pulse,
  ShieldCheck,
  Sparkle,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";

export const AUTH_FEATURES: {
  icon: Icon;
  step: string;
  title: string;
  description: string;
  tag: string;
}[] = [
  {
    icon: GitBranch,
    step: "01",
    title: "Visual workflow canvas",
    description: "Design event-driven automations with nodes, branches, and live testing.",
    tag: "Canvas",
  },
  {
    icon: Plugs,
    step: "02",
    title: "Integrations built in",
    description: "Connect Slack, email, webhooks, spreadsheets, and AI models in one place.",
    tag: "Connect",
  },
  {
    icon: Pulse,
    step: "03",
    title: "Live execution monitoring",
    description: "Follow every run in real time with step-by-step logs and status updates.",
    tag: "Runs",
  },
  {
    icon: SquaresFour,
    step: "04",
    title: "Start from templates",
    description: "Launch faster with pre-built workflow templates you can customize and deploy.",
    tag: "Templates",
  },
  {
    icon: Key,
    step: "05",
    title: "Credential vault",
    description: "Store API keys and OAuth tokens securely, scoped to your workspace.",
    tag: "Vault",
  },
  {
    icon: Sparkle,
    step: "06",
    title: "AI-native actions",
    description: "Drop in OpenAI and custom model steps with prompts tuned per workflow.",
    tag: "AI",
  },
  {
    icon: ShieldCheck,
    step: "07",
    title: "Secure by default",
    description: "Encrypted secrets, authenticated access, and a full audit trail for every execution.",
    tag: "Trust",
  },
];

export const authInputClass =
  "w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 font-manrope text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export const authModeSwitchWrapClass =
  "grid grid-cols-2 gap-1 rounded-xl border border-border/50 bg-surface-container-high p-1";

export const authModeSwitchActiveClass =
  "rounded-lg bg-card px-4 py-2.5 font-manrope text-[14px] font-bold text-on-surface shadow-sm ring-1 ring-border/50";

export const authModeSwitchIdleClass =
  "rounded-lg px-4 py-2.5 font-manrope text-[14px] font-bold text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface";

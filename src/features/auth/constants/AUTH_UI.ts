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
}[] = [
  {
    icon: GitBranch,
    step: "01",
    title: "Visual workflow canvas",
    description: "Build automations from real events, with clear paths and live testing.",
  },
  {
    icon: Plugs,
    step: "02",
    title: "Integrations built in",
    description: "Connect Slack, email, your store, spreadsheets, and AI in one place.",
  },
  {
    icon: Pulse,
    step: "03",
    title: "See what's happening live",
    description: "Follow every automation in real time with a clear step-by-step history.",
  },
  {
    icon: SquaresFour,
    step: "04",
    title: "Start from templates",
    description: "Launch faster with ready-made templates you can customize and turn on.",
  },
  {
    icon: Key,
    step: "05",
    title: "Saved connections",
    description: "Store passwords and app logins securely, kept private to your account.",
  },
  {
    icon: Sparkle,
    step: "06",
    title: "Built-in AI steps",
    description: "Add AI steps you can word yourself — tuned for each automation.",
  },
  {
    icon: ShieldCheck,
    step: "07",
    title: "Secure by default",
    description: "Encrypted logins, secure sign-in, and a full history of what happened each time.",
  },
];

export const authInputClass =
  "w-full rounded-xl border border-border/50 bg-surface-variant/30 px-4 py-3 font-manrope text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

/** Off-screen fields that absorb Chrome’s generic login autofill. */
export const authAutofillTrapClass =
  "pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0";

export const authModeSwitchWrapClass =
  "grid grid-cols-2 gap-1 rounded-xl border border-border/50 bg-surface-container-high p-1";

export const authModeSwitchActiveClass =
  "rounded-lg bg-card px-4 py-2.5 font-manrope text-[14px] font-bold text-on-surface shadow-sm ring-1 ring-border/50";

export const authModeSwitchIdleClass =
  "rounded-lg px-4 py-2.5 font-manrope text-[14px] font-bold text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface";

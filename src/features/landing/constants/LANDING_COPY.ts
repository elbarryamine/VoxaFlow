export const LANDING_NAV = [
  { label: "Home", sectionId: "hero" },
  { label: "About", sectionId: "about" },
  { label: "Why", sectionId: "why" },
  { label: "Features", sectionId: "features" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const LANDING_FOOTER = {
  tagline: "Automations with a point of view.",
  blurb:
    "A visual studio for commerce and ops teams — draw flows, watch runs, ship without duct tape.",
  cta: "Open the studio",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Home", sectionId: "hero" },
        { label: "About", sectionId: "about" },
        { label: "Why Auren", sectionId: "why" },
        { label: "Features", sectionId: "features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Get started", sectionId: "get-started" },
      ],
    },
    {
      title: "Account",
      links: [{ label: "Sign in", href: "/auth/sign-in" }],
    },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  finePrint: "Prices shown in USD. Plans reflect current studio capabilities.",
} as const;

export const LANDING_HERO = {
  kicker: "Workflow studio — 2026",
  headlineLead: "Your automations,",
  headlineAccent: "drawn",
  headlineTail: "not duct-taped.",
  subheadline:
    "Auren is a canvas for people who think in flows: sketch triggers, branch logic, plug in AI, and read every run like a story.",
  cta: "Open the studio",
  ctaHint: "Free to start · email or Google",
} as const;

export const LANDING_MANIFESTO = [
  "Most tools bury you in config files.",
  "We put the graph on stage — nodes, edges, and live runs in one warm room.",
  "You see what fires, what waits, and what fails. No mystery meat automation.",
] as const;

export const LANDING_TAPE = [
  "webhook in",
  "branch",
  "delay",
  "openai",
  "slack",
  "email",
  "sheet",
  "log",
  "retry",
  "vault",
  "template",
  "ship",
] as const;

export const LANDING_CTA = {
  kicker: "Get started",
  figLabel: "Fig. Z — Open studio",
  headline: "Start with a blank canvas",
  headlineAccent: "or a template that ships.",
  subheadline:
    "Sign in with email or Google, connect your stack, and publish your first automation in minutes — not after a sprint of wiring webhooks.",
  action: "Open the studio",
  hint: "Free to start · no credit card",
} as const;

export const LANDING_FEATURES = {
  kicker: "Features",
  title: "Seven things the studio does well",
  subheadline: "Build workflows, connect your tools, and watch every run — all in one place.",
} as const;

export const LANDING_WHY = {
  kicker: "Why",
  headline: "Most automation tools speak developer.",
  headlineAccent: "Auren speaks business.",
  subheadline:
    "Set up cart recovery, Slack alerts, and more on a visual canvas — no code required.",
  contrast: {
    others: {
      label: "The usual stack",
      points: [
        "Config files, custom code, and opaque error logs",
        "Weeks wiring webhooks before anything ships",
        "Built for engineers — ops teams inherit the mess",
      ],
    },
    auren: {
      label: "With Auren",
      points: [
        "A visual canvas anyone on the team can read",
        "Templates for commerce, support, and growth — live in minutes",
        "Runs you can follow step by step, no mystery meat",
      ],
    },
  },
  pillars: [
    {
      title: "Less technical, more legible",
      description:
        "Draw triggers, branches, and actions on a canvas — not buried in JSON. Your merchandiser sees the same graph your engineer does.",
      tag: "Clarity",
    },
    {
      title: "Ready for commerce & ops",
      description:
        "Order events, inventory signals, and customer touchpoints are first-class. Plug into the stack you already run — without standing up a mini dev project.",
      tag: "Commerce",
    },
    {
      title: "Templates that ship",
      description:
        "Start from proven flows — lead capture, support routing, enrichment — then tailor nodes to your brand. Customize in the studio, not in a repo.",
      tag: "Templates",
    },
  ],
} as const;

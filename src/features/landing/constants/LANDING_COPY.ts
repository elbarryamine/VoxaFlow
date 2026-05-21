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
    "A visual studio for shops and teams — build automations, watch them work, without messy workarounds.",
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
  finePrint: "Prices shown in USD. Plans reflect what's available today.",
} as const;

export const LANDING_HERO = {
  kicker: "Workflow studio — 2026",
  headlineLead: "Your automations,",
  headlineAccent: "drawn",
  headlineTail: "not patched together.",
  subheadline:
    "Auren is a canvas for how you already think: when something happens, add yes/no paths, use AI, and see every step play out clearly.",
  cta: "Open the studio",
  ctaHint: "Free to start · email or Google",
} as const;

export const LANDING_MANIFESTO = [
  "Most tools bury you in hidden settings and code.",
  "We put your workflow on screen — steps, connections, and live progress in one place.",
  "You see what starts, what waits, and what fails. Nothing hidden.",
] as const;

export const LANDING_TAPE = [
  "new order",
  "yes or no",
  "wait",
  "ai step",
  "slack",
  "email",
  "sheet",
  "history",
  "try again",
  "saved keys",
  "template",
  "go live",
] as const;

export const LANDING_CTA = {
  kicker: "Get started",
  figLabel: "Fig. Z — Open studio",
  headline: "Start with a blank canvas",
  headlineAccent: "or a ready-made template.",
  subheadline:
    "Sign in with email or Google, connect your tools, and turn on your first automation in minutes — not after weeks of setup.",
  action: "Open the studio",
  hint: "Free to start · no credit card",
} as const;

export const LANDING_FEATURES = {
  kicker: "Features",
  title: "Seven things the studio does well",
  subheadline: "Build workflows, connect your tools, and watch every step — all in one place.",
} as const;

export const LANDING_WHY = {
  kicker: "Why",
  headline: "Most automation tools speak developer.",
  headlineAccent: "Auren speaks business.",
  subheadline:
    "Set up cart recovery, Slack alerts, and more on a visual canvas — no code required.",
  contrast: {
    others: {
      label: "The usual tools",
      points: [
        "Hidden settings, custom code, and confusing error messages",
        "Weeks connecting apps before anything goes live",
        "Built for developers — everyone else inherits the mess",
      ],
    },
    auren: {
      label: "With Auren",
      points: [
        "A visual canvas anyone on the team can read",
        "Templates for commerce, support, and growth — live in minutes",
        "A clear history you can follow step by step",
      ],
    },
  },
  pillars: [
    {
      title: "Less technical, more clear",
      description:
        "Map starters, paths, and actions on a canvas — not buried in code. Your whole team sees the same workflow.",
      tag: "Clarity",
    },
    {
      title: "Ready for shops & teams",
      description:
        "Orders, inventory, and customer updates are built in. Connect the tools you already use — without a small IT project.",
      tag: "Commerce",
    },
    {
      title: "Templates that go live",
      description:
        "Start from proven automations — lead capture, support routing, follow-ups — then customize each step for your brand. All in the studio, not in code elsewhere.",
      tag: "Templates",
    },
  ],
} as const;

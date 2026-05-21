export const PRICING_HERO = {
  kicker: "Pricing",
  headline: "Start on the canvas.",
  headlineAccent: "Scale when runs do.",
  subheadline:
    "Every plan includes the visual studio, live execution logs, and credential vault. Upgrade when your automations outgrow the free runway — no surprise seat math.",
} as const;

export const PRICING_PLANS = [
  {
    id: "canvas",
    fig: "Plan A",
    name: "Canvas",
    price: "$0",
    period: "forever",
    description: "For solo builders sketching their first flows.",
    cta: "Start free",
    ctaHref: "/auth/sign-in",
    highlighted: false,
    features: [
      "3 active workflows",
      "500 runs per month",
      "Core triggers & actions",
      "7-day run history",
      "Community templates",
    ],
  },
  {
    id: "studio",
    fig: "Plan B",
    name: "Studio",
    price: "$29",
    period: "per month",
    description: "For shops and teams shipping automations every week.",
    cta: "Open Studio",
    ctaHref: "/auth/sign-in",
    highlighted: true,
    badge: "Most chosen",
    features: [
      "Unlimited workflows",
      "10,000 runs per month",
      "AI & branch nodes",
      "90-day run history",
      "All starter templates",
      "Slack & email actions",
      "Priority webhook ingest",
    ],
  },
  {
    id: "operations",
    fig: "Plan C",
    name: "Operations",
    price: "$79",
    period: "per month",
    description: "For ops leads running commerce at volume.",
    cta: "Talk to us",
    ctaHref: "/auth/sign-in",
    highlighted: false,
    features: [
      "Everything in Studio",
      "50,000 runs per month",
      "5 workspace seats",
      "1-year run archive",
      "Shared credential vault",
      "Run replay & exports",
      "Dedicated onboarding",
    ],
  },
] as const;

export const PRICING_NOTES = [
  "Runs count each node execution in a workflow — retries included once.",
  "Annual billing saves 20% on Studio and Operations (coming soon).",
  "Need more volume? We'll tune a plan around your peak season.",
] as const;

export const PRICING_FAQ = [
  {
    question: "What counts as a run?",
    answer:
      "Each time a workflow executes — whether from a webhook, manual test, or schedule — that's one run. Nodes inside the flow don't multiply your bill; one trigger firing one workflow is one run.",
  },
  {
    question: "Can I change plans anytime?",
    answer:
      "Yes. Upgrade when you need more runway; downgrade at the end of your billing cycle. Your canvas and workflow definitions stay put.",
  },
  {
    question: "Do you charge per seat on Canvas?",
    answer:
      "Canvas is free for one builder. Studio is priced for a single workspace owner; Operations includes five seats for merchandising, support, and engineering to share the same studio.",
  },
  {
    question: "Which integrations are included?",
    answer:
      "Shopify webhooks, custom HTTP triggers, OpenAI, Slack, email, delays, and spreadsheet actions are available on paid plans. Canvas includes the core set to learn the graph.",
  },
  {
    question: "Is there a trial for Studio?",
    answer:
      "Start on Canvas at no cost. When you're ready, upgrade to Studio — your existing workflows and credentials carry over without rebuilding.",
  },
] as const;

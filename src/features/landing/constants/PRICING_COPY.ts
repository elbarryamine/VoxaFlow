export const PRICING_HERO = {
  kicker: "Pricing",
  headline: "Start on the canvas.",
  headlineAccent: "Grow when you need to.",
  subheadline:
    "Every plan includes the visual studio, live history, and secure saved connections. Upgrade when you outgrow the free plan — no surprise fees per person.",
} as const;

export const PRICING_PLANS = [
  {
    id: "canvas",
    fig: "Plan A",
    name: "Canvas",
    price: "$0",
    period: "forever",
    description: "For solo builders creating their first automations.",
    cta: "Start free",
    ctaHref: "/auth/sign-in",
    highlighted: false,
    features: [
      "3 active workflows",
      "500 runs per month",
      "Main starters & actions",
      "7-day history",
      "Community templates",
    ],
  },
  {
    id: "studio",
    fig: "Plan B",
    name: "Studio",
    price: "$29",
    period: "per month",
    description: "For shops and teams running automations every week.",
    cta: "Open Studio",
    ctaHref: "/auth/sign-in",
    highlighted: true,
    badge: "Most chosen",
    features: [
      "Unlimited workflows",
      "10,000 runs per month",
      "AI & yes/no paths",
      "90-day history",
      "All starter templates",
      "Slack & email actions",
      "Priority incoming events",
    ],
  },
  {
    id: "operations",
    fig: "Plan C",
    name: "Operations",
    price: "$79",
    period: "per month",
    description: "For teams running commerce at higher volume.",
    cta: "Talk to us",
    ctaHref: "/auth/sign-in",
    highlighted: false,
    features: [
      "Everything in Studio",
      "50,000 runs per month",
      "5 team seats",
      "1-year history archive",
      "Shared saved connections",
      "Replay & export history",
      "Dedicated onboarding",
    ],
  },
] as const;

export const PRICING_NOTES = [
  "A run is each time an automation completes — retries count once.",
  "Annual billing saves 20% on Studio and Operations (coming soon).",
  "Need more volume? We'll shape a plan around your busy season.",
] as const;

export const PRICING_FAQ = [
  {
    question: "What counts as a run?",
    answer:
      "Each time an automation runs — from a new order, a manual test, or a schedule — that's one run. Steps inside don't multiply your bill; one trigger starting one automation is one run.",
  },
  {
    question: "Can I change plans anytime?",
    answer:
      "Yes. Upgrade when you need more room; downgrade at the end of your billing cycle. Your workflows stay as they are.",
  },
  {
    question: "Do you charge per person on Canvas?",
    answer:
      "Canvas is free for one person. Studio covers one account owner; Operations includes five seats so merchandising, support, and tech can share the same studio.",
  },
  {
    question: "Which integrations are included?",
    answer:
      "Shopify, custom incoming links, OpenAI, Slack, email, wait steps, and spreadsheets are on paid plans. Canvas includes the basics to learn the canvas.",
  },
  {
    question: "Is there a trial for Studio?",
    answer:
      "Start on Canvas at no cost. When you're ready, upgrade to Studio — your workflows and saved connections come with you.",
  },
] as const;

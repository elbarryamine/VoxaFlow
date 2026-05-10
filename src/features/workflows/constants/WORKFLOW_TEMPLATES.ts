import { Lightning, Globe, Path, ChatCircleText } from "@phosphor-icons/react";

export const WORKFLOW_TEMPLATES = [
  {
    id: "lead-gen",
    title: "Lead Generation",
    description: "Qualify inbound leads and sync them to your CRM automatically.",
    icon: Lightning,
  },
  {
    id: "support",
    title: "Customer Support",
    description: "Handle common support queries and escalate to the right team.",
    icon: ChatCircleText,
  },
  {
    id: "data-enrichment",
    title: "Data Enrichment",
    description: "Fetch and process data from external APIs and databases.",
    icon: Globe,
  },
  {
    id: "dynamic-routing",
    title: "Dynamic Routing",
    description: "Analyze user intent and route data through custom logic paths.",
    icon: Path,
  },
];
